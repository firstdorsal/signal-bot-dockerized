const express = require('express');
const {
    spawn,
    exec
} = require('child_process');
const app = express();
app.listen(process.env.PORT ? process.env.PORT : 3000);
app.use(express.json());
const signalCliPath = 'signal-cli/bin/signal-cli'; //'signal-cli/bin/signal-cli';
console.log('server started');
const debug = process.env.DEBUG ? process.env.DEBUG : true;


/**
 * Initialize a registration with the signal server either via text or voice verification.
 * @example
 * curl -X POST localhost:3000/register/init --header "Content-Type: application/json" --data '{"number":"+49someNumber","voice":true}'; echo
 */
app.post('/register/init', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    signalCli(res, req.body.voice ? ['-u', req.body.number, 'register', '--voice'] : ['-u', req.body.number, 'register']);
});


/**
 * Verify the previously initialized registration with the signal server by sending the verification code.
 * @example
 * curl -X POST localhost:3000/register/verify --header "Content-Type: application/json" --data '{"number":"+49someNumber","verificationCode":someVerificationCode}'; echo
 */
app.post('/register/verify', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    if (!req.body.verificationCode) {
        res.send('Error: Missing field: verificationCode');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'verify', req.body.verificationCode]);
});
/**
 * Send a simple text message to one recipient
 * @example
 * curl -X POST localhost:3000/send --header "Content-Type: application/json" --data '{"message":"test","number":"+49someNumber","recipient":"+49someRecipientNumber"}'; echo
 */
app.post('/send', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    if (!req.body.recipient) {
        res.send('Error: Missing field: recipient');
        return;
    }
    if (!req.body.message) {
        res.send('Error: Missing field: message');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'send', '-m', req.body.message, req.body.recipient]);
});

app.post('/listIdentities', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'listIdentities']);
});
/**
 * Ask for new messages for given number.
 * @example
 * curl -X POST localhost:3000/receive --header "Content-Type: application/json" --data '{"number":"+49someNumber"}'; echo
 */
app.post('/receive', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number')
        return;
    }
    signalCli(res, ['-u', req.body.number, 'receive', '--json']);
});

/**
 * Contact the signal bot with a raw cursor.
 * @example
 * curl -X POST localhost:3000/raw --header "Content-Type: application/json" --data '{"raw":"-u +49someNumber receive"}'; echo
 */
app.post('/raw', async (req, res) => {
    if (!req.body.raw) {
        res.send('Error: Missing field: raw')
        return;
    }
    signalCli(res, `${req.body.raw} --json`, true);
});

app.get("*", async (req, res) => {
    res.send({
        message: 'Invalid Path'
    });
});

app.post("*", async (req, res) => {
    res.send({
        message: 'Invalid Path'
    });
});

function signalCli(res, args, raw = false) {
    const signalCli = raw ? exec(`${signalCliPath} ${args}`) : spawn(signalCliPath, args);
    let stdres = [];

    signalCli.stderr.on('data', (data) => {
        if (debug) console.error(`stderr: ${data}`);
        stdres.push(data.toString());
    });

    signalCli.stdout.on('data', (data) => {
        if (debug) console.error(`stdout: ${data}`);
        stdres.push(JSON.parse(data));
    });
    signalCli.on('close', async (code) => {
        if (debug) console.error(`exitCode: ${code}`);
        res.send(JSON.stringify({
            code,
            stdres
        }))
    });
}