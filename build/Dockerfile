FROM node:16.14.0 as builder

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

RUN apk add --no-cache supervisor gcompat nginx nodejs npm bash gettext
RUN apk upgrade

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN npm i --production

COPY startRpNode.sh /srv/rocketpool
RUN chmod a+x /srv/rocketpool/startRpNode.sh
COPY user-settings.template /srv/rocketpool

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

# For testing
RUN echo 'alias rp="rocketpool --daemon-path /usr/local/bin/rocketpoold --config-path /srv/rocketpool --allow-root"' >> ~/.bashrc
RUN echo 'alias rpd="rocketpoold --settings /srv/rocketpool/user-settings.yml api"' >> ~/.bashrc

# TODO?
# RUN useradd nginx

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


