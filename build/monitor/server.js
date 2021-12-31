const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const exec = require("child_process").exec;
const fs = require('fs');
const archiver = require('archiver');

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
server.get("/"+backupFileName, (req, res) => {
    const filepath = "/tmp/" + backupFileName;
    console.log("Creating backup in " + filepath);
    
    fs.unlink(filepath, (err) => { }); // delete if exists

    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(filepath);
    archive
        .directory("/rocketpool", true)
        .on('error', err => reject(err))
        .pipe(stream)
        ;
    archive.finalize();
    
    stream.on('close', () => {
        const rs = fs.createReadStream(filepath);
        res.setHeader("Content-Disposition", "attachment; " + backupFileName);
        res.setHeader("Content-Type", "application/zip");
        rs.pipe(res);
    });
});

server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
