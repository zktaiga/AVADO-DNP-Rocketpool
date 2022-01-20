ARG PRYSM_VERSION
FROM  gcr.io/prysmaticlabs/prysm/validator:${PRYSM_VERSION} as validator

FROM node:16.13.1 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

FROM alpine:latest
ARG RP_VERSION

RUN mkdir -p /srv/rocketpool

RUN wget "https://github.com/rocket-pool/smartnode-install/releases/download/${RP_VERSION}/rocketpool-cli-linux-amd64" -O /usr/local/bin/rocketpool
RUN wget "https://github.com/rocket-pool/smartnode-install/releases/download/${RP_VERSION}/rocketpool-daemon-linux-amd64" -O /usr/local/bin/rocketpoold

RUN chmod +x /usr/local/bin/rocketpool /usr/local/bin/rocketpoold

COPY --from=validator /app/cmd/validator/validator /usr/local/bin/validator

RUN apk add supervisor gcompat nginx nodejs npm

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN npm i --production

COPY config-mainnet.yml /srv/rocketpool
COPY config-prater.yml /srv/rocketpool
COPY restart-validator.sh /srv/rocketpool
COPY settings.yml /srv/rocketpool

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

# For testing
RUN echo 'alias rp="rocketpool -d /usr/local/bin/rocketpoold -c /srv/rocketpool --allow-root"' >> ~/.bashrc
RUN echo 'alias rpdp="/usr/local/bin/rocketpoold --config /srv/rocketpool/config-prater.yml --settings /srv/rocketpool/settings.yml api"' >> ~/.bashrc
RUN echo 'alias rpdm="/usr/local/bin/rocketpoold --config /srv/rocketpool/config-mainnet.yml --settings /srv/rocketpool/settings.yml api"' >> ~/.bashrc

# TODO?
# RUN useradd nginx

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


