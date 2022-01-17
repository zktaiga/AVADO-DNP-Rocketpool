const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const exec = require("child_process").exec;
const fs = require('fs');
const archiver = require('archiver');
const AdmZip = require("adm-zip");
const jsonfile = require('jsonfile')

console.log("Monitor starting...");

const server = restify.createServer({
    name: "MONITOR",
    version: "1.0.0"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "http://*.dappnode.eth",
        "http://*.my.ava.do"
    ]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.post("/rpd", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        rpd(req.body.command).then((stdout) => {
            res.send(200, stdout);
            return next();
        }).catch((e) => {
            res.send(500, e);
            return next();
        })
    }
});

const execute = (cmd) => {
    return new Promise((resolve, reject) => {
        const child = exec(cmd, (error, stdout, stderr) => {
            const debug = false;
            if (debug) {
                switch(cmd) {
                    case "wallet init":
                        return resolve('{"status":"success","error":"","mnemonic":"corn wool actor cable marine anger nothing return coast energy magnet evolve best lion dutch clerk visit begin agree about sing federal sausage ribbon","accountAddress":"0xd97afeffa7ce00aa489e5c88880e124fb75b8e05"}');
                    case "node register":
                        return resolve('{"status":"success","error":"","txHash":"0x27f5b5bb3905cd135cdef17e71f6f9ac70e3e95fd372999cb4eea918f3990310"}');
                    case "network rpl-price":
                        return resolve('{"status":"success","error":"","rplPrice":11613106459524954,"rplPriceBlock":6199200,"minPerMinipoolRplStake":137775366614993524895,"maxPerMinipoolRplStake":2066630499224902873416}');
                    default :
                    return resolve('{"status":"success","error":""}');
                }
            } else {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject(error.message);
                }
                if (stderr) {
                    console.log(`error: ${stderr}`);
                    return reject(stderr);
                }
                return resolve(stdout);
            }
        });
        child.stdout.on('data', (data) => console.log(data.toString()));
    });
}

const storeTxHash = (txHash) => {
    const transactionsFile = "/rocketpool/data/transactions.json";
    console.log(`Store hash ${txHash} to ${transactionsFile}`);
    try {
        const data = (fs.existsSync(transactionsFile)) ? jsonfile.readFileSync(transactionsFile) : { transactions: [] };
        data.transactions.push(txHash);
        jsonfile.writeFileSync(transactionsFile, data);
    } catch (e) {
        console.error(e)
    }
}

const rpd = (command) => {
    const cmd = `/usr/local/bin/rocketpoold --config /srv/rocketpool/config.yml --settings /srv/rocketpool/settings.yml api ${command}`;
    console.log(`Running ${cmd}`);
    if (command.includes("wallet") && !command.includes("status")) {
        const datafolder = "/rocketpool/data";
        if (!fs.existsSync(datafolder)) {
            console.log("Creating " + datafolder)
            fs.mkdirSync(datafolder);
        }
    }
    const executionPromise = execute(cmd);

    executionPromise.then((result) => {
        const data = JSON.parse(result);
        if (command.includes("wallet init") && "mnemonic" in data) {
            // store mnemonic to file
            fs.writeFile("/rocketpool/data/mnemonic", data.mnemonic, (err) => console.log(err ? err : "Saved mnemoic"));
        }
        if ("txHash" in data) {
            storeTxHash(data.txHash);
        }
    })

    return executionPromise;
}

const restartValidator = () => {
    console.log(`Restart validator`);
    const cmd = "sh /srv/rocketpool/restart-validator.sh";
    return execute(cmd);
}

server.get("/restart-validator", (req, res) => {
    restartValidator().then((stdout) => {
        res.send(200, stdout);
    }).catch((e) => {
        res.send(500, e);
    })
});

//backup
const backupFileName = "rocket-pool-backup.zip";
server.get("/" + backupFileName, (req, res) => {
    res.setHeader("Content-Disposition", "attachment; " + backupFileName);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive
        .directory("/rocketpoo/data", "data", true)
        .on('error', err => reject(err))
        .pipe(res)
        ;
    archive.finalize();
});

//restore
//TODO: 2 separate methods for validate and restore
server.post('/upload-test', (req, res, next) => {
    console.log("upload test");
    if (req.files.file) {
        const file = req.files.file;
        req.info = file.name;
        const zipfilePath = "/tmp/" + file.name;
        fs.rename(file.path, zipfilePath, (err) => { if (err) console.log('ERROR: ' + err) });
        console.log("received " + file.name);
        try {
            validateZipFile(zipfilePath);
        } catch (e) {
            console.log(e);
            res.send({
                code: 400,
                message: e.message,
            });
            next();
            return;
        }

        // delete existing data folder (if it exists)
        fs.unlink("/rocketpool/data", (err) => { });
        // unzip
        const zip = new AdmZip(zipfilePath);
        zip.extractAllTo("/rocketpool/data", /*overwrite*/ true);
    }

    function validateZipFile(zipfilePath) {
        const zip = new AdmZip(zipfilePath);
        const zipEntries = zip.getEntries();

        const containsDataFolder = zipEntries.some((entry) => entry.isDirectory && entry.entryName == "data");
        // if (!containsDataFolder) return error...

    }



    //     and actually restore

    res.send({
        code: 'success',
        info: req.info,
        message: 'Backup file is not implemented yet, but thanks for trying (TODO)',
    });
    next();
});



server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
