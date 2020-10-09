FROM openjdk:16-slim-buster

RUN apt-get update; apt-get install -y curl wget \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh 

RUN cd / ;\
    export VERSION=0.6.10 ;\
    wget https://github.com/AsamK/signal-cli/releases/download/v"${VERSION}"/signal-cli-"${VERSION}".tar.gz ;\
    mkdir -p /signal-bot/signal-cli/ ;\
    tar xf signal-cli-"${VERSION}".tar.gz -C /signal-bot/signal-cli/ ;\
    mv /signal-bot/signal-cli/signal-cli-"${VERSION}"/* /signal-bot/signal-cli/ ;\
    rm -r /signal-bot/signal-cli/signal-cli-"${VERSION}"/ ;\
    rm /signal-cli-"${VERSION}".tar.gz
WORKDIR /signal-bot/
COPY package.json /signal-bot/package.json
RUN npm install
COPY index.js /signal-bot/index.js
ENTRYPOINT [ "node", "/signal-bot/index.js" ]
