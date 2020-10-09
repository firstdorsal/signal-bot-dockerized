import express from 'express';
const { spawn } = require('child_process');
const app = express();
app.listen(process.env.PORT ? process.env.PORT : 3000);
app.use(express.json());
const signalCliPath: String = '../signal-cli/bin/signal-cli';//'signal-cli/bin/signal-cli';
console.log('server started');
const debug = process.env.DEBUG ? process.env.DEBUG : true;



app.post('/register/init', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number')
        return;
    }
    signalCli(res, req.body.voice ? ['-u', req.body.number, 'register', '--voice'] : ['-u', req.body.number, 'register']);
});

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

app.post('/receive', async (req, res) => {
    if (!req.body.number) {
        res.send('Error: Missing field: number')
        return;
    }
    signalCli(res, ['-u', req.body.number, 'receive', '--json']);
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


function signalCli(res: any, args: String[]) {
    const signalCli = spawn(signalCliPath, args);
    let stdres: String[] = [];

    signalCli.stderr.on('data', (data: Buffer) => {
        if (debug) console.error(`stderr: ${data}`);
        stdres.push(data.toString().replace('\\n', ''));
    });

    signalCli.stdout.on('data', (data: Buffer) => {
        if (debug) console.error(`stdout: ${data}`);
        stdres.push(data.toString().replace('\n', ''));
    });
    signalCli.on('close', async (code: String) => {
        if (debug) console.error(`exitCode: ${code}`);
        res.send(JSON.stringify({ code, stdres }))
    });
}