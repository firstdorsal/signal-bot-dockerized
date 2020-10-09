"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { spawn } = require('child_process');
const app = express_1.default();
app.listen(process.env.PORT ? process.env.PORT : 3000);
app.use(express_1.default.json());
const signalCliPath = '../signal-cli/bin/signal-cli'; //'signal-cli/bin/signal-cli';
console.log('server started');
const debug = process.env.DEBUG ? process.env.DEBUG : true;
app.post('/register/init', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    signalCli(res, req.body.voice ? ['-u', req.body.number, 'register', '--voice'] : ['-u', req.body.number, 'register']);
}));
app.post('/register/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    if (!req.body.verificationCode) {
        res.send('Error: Missing field: verificationCode');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'verify', req.body.verificationCode]);
}));
app.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
app.post('/listIdentities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'listIdentities']);
}));
app.post('/receive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.number) {
        res.send('Error: Missing field: number');
        return;
    }
    signalCli(res, ['-u', req.body.number, 'receive', '--json']);
}));
app.get("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: 'Invalid Path'
    });
}));
app.post("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: 'Invalid Path'
    });
}));
function signalCli(res, args) {
    const signalCli = spawn(signalCliPath, args);
    let stdres = [];
    signalCli.stderr.on('data', (data) => {
        if (debug)
            console.error(`stderr: ${data}`);
        stdres.push(data.toString().replace('\\n', ''));
    });
    signalCli.stdout.on('data', (data) => {
        if (debug)
            console.error(`stdout: ${data}`);
        stdres.push(data.toString().replace('\n', ''));
    });
    signalCli.on('close', (code) => __awaiter(this, void 0, void 0, function* () {
        if (debug)
            console.error(`exitCode: ${code}`);
        res.send(JSON.stringify({ code, stdres }));
    }));
}
