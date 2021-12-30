ARG PRYSM_VERSION
FROM  gcr.io/prysmaticlabs/prysm/validator:${PRYSM_VERSION} as validator

FROM node:16.13.1 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build



FROM alpine:latest

RUN mkdir -p /srv/rocketpool

#RUN wget https://github.com/rocket-pool/smartnode-install/releases/download/${RP_VERSION}/rocketpool-cli-linux-amd64 -O /usr/local/bin/rocketpool
RUN wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-cli-linux-amd64 -O /usr/local/bin/rocketpool

RUN wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-daemon-linux-amd64 -O /usr/local/bin/rocketpoold

RUN chmod +x /usr/local/bin/rocketpool /usr/local/bin/rocketpoold

COPY --from=validator /app/cmd/validator/validator /usr/local/bin/validator

RUN apk add supervisor gcompat nginx nodejs npm

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN npm i --production

COPY config.yml /srv/rocketpool
COPY restart-validator.sh /srv/rocketpool
COPY settings.yml /srv/rocketpool

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

COPY test.sh /

# RUN useradd nginx

ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


