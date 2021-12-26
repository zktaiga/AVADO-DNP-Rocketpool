const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const exec = require("child_process").exec;
const fs = require('fs');
const path = require("path");

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

    rpd(req.body.language, req.body.password, req.body.amount).then((stdout) => {
        res.send(200, stdout);
    }).catch((e) => {
        res.send(500, e);
    })
});

const rpd = () => {
    return new Promise((resolve, reject) => {
        const cmd = `/usr/local/bin/rocketpoold --config /srv/rocketpool/config.yml --settings /srv/rocketpool/settings.yml api $command`;
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
        child.stdout.on('data', function(data) {
            console.log(data.toString()); 
        });
    });

}

server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
