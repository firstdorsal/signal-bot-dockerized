

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

```
curl -X POST localhost:3000/register/init --header "Content-Type: application/json" --data '{"number":"+49someNumber","voice":true}'; echo
```

**Verify the previously initialized registration with the signal server by sending the verification code**

```
curl -X POST localhost:3000/register/verify --header "Content-Type: application/json" --data '{"number":"+49someNumber","verificationCode":someVerificationCode}'; echo
```

**Send a simple text message to one recipient**

```
curl -X POST localhost:3000/send --header "Content-Type: application/json" --data '{"message":"test","number":"+49someNumber","recipient":"+49someRecipientNumber"}'; echo
```

**Ask for new messages for given number**

```
curl -X POST localhost:3000/receive --header "Content-Type: application/json" --data '{"number":"+49someNumber"}'; echo
```

**Contact the signal bot with a raw cursor to do anything the [signal-cli](https://github.com/AsamK/signal-cli) can do**


```
curl -X POST localhost:3000/raw --header "Content-Type: application/json" --data '{"raw":"-u +49someNumber receive"}'; echo
```



# Need help or missing a feature?
Feel free to contact me via [xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@firstdorsal.eu](mailto:xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@y.gy) in english or german

## Links
[Code](https://git.y.gy/firstdorsal/signal-bot-dockerized)

[Signal-Cli](https://github.com/AsamK/signal-cli)
