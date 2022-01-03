const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const exec = require("child_process").exec;
const fs = require('fs');
const archiver = require('archiver');
const AdmZip = require("adm-zip");

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
    }

    rpd(req.body.command).then((stdout) => {
        res.send(200, stdout);
    }).catch((e) => {
        res.send(500, e);
    })
    next();
});

const rpd = (command) => {
    return new Promise((resolve, reject) => {
        const cmd = `/usr/local/bin/rocketpoold --config /srv/rocketpool/config.yml --settings /srv/rocketpool/settings.yml api ${command}`;
        console.log(`Running ${cmd}`);
        const child = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error.message);
            }
            if (stderr) {
                return reject(stderr);
            }
            return resolve(stdout);
        });
        child.stdout.on('data', function (data) {
            console.log(data.toString());
        });
    });
}

//backup
const backupFileName = "rocket-pool-backup.zip";
server.get("/" + backupFileName, (req, res) => {
    // const archive = new AdmZip();
    // archive.addLocalFolder("/rocketpool/data", "/data")
    // const buffer = archive.toBuffer()
    // buffer.pipe(res);
    
    res.setHeader("Content-Disposition", "attachment; " + backupFileName);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive
        .directory("/rocketpoo/datal", "data", true)
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
        } catch(e) {
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

        const containsDataFolder = zipEntries.some((entry)=>entry.isDirectory && entry.entryName == "data");
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
