# signal bot dockerized
<img draggable="none" src="https://git.y.gy/firstdorsal/signal-bot-dockerized/-/raw/master/logo.jpg" style="float:left; margin-right:10px;" height="100"> 

## Use the signal cli in a docker container and access it through http

[![Code](https://ico.y.gy/website?down_color=red&down_message=offline&label=repository&up_color=success&up_message=online&url=https%3A%2F%2Fgit.y.gy%2Ffirstdorsal%2Fsignal-bot-dockerized&style=flat-square&logo=gitlab)](https://git.y.gy/firstdorsal/signal-bot-dockerized/)


# Install

Build it yourself
```
git clone https://git.y.gy/firstdorsal/signal-bot-dockerized .
docker-compose up -d --build
```
or use the build on hub.docker.com
```
firstdorsal/signal-bot
```
# Basic usage

**Initialize a registration with the signal server either via text or voice verification**

```bash
curl -X POST localhost:3000/register/init --header "Content-Type: application/json" --data '{"number":"+49someNumber","voice":true}'; echo
```

**Verify the previously initialized registration with the signal server by sending the verification code**

```bash
curl -X POST localhost:3000/register/verify --header "Content-Type: application/json" --data '{"number":"+49someNumber","verificationCode":someVerificationCode}'; echo
```

**Send a simple text message to one recipient**

```bash
curl -X POST localhost:3000/send --header "Content-Type: application/json" --data '{"message":"test","number":"+49someNumber","recipient":"+49someRecipientNumber"}'; echo
```

**Ask for new messages for given number**

```bash
curl -X POST localhost:3000/receive --header "Content-Type: application/json" --data '{"number":"+49someNumber"}'; echo
```

**Contact the signal bot with a raw cursor to do anything the [signal-cli](https://github.com/AsamK/signal-cli) can do**


```bash
curl -X POST localhost:3000/raw --header "Content-Type: application/json" --data '{"raw":"-u +49someNumber receive"}'; echo
```


# usage on a raspberrypi or other arm devices
use 
```Dockerfile
FROM adoptopenjdk/openjdk11:armv7l-debianslim-jdk11u-nightly-slim
```
in the first line of the dockerfile


# Need help or missing a feature?
Feel free to contact me via [xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@firstdorsal.eu](mailto:xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@y.gy) in english or german

## Links
[Code](https://git.y.gy/firstdorsal/signal-bot-dockerized)

[Signal-Cli](https://github.com/AsamK/signal-cli)
