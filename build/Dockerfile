FROM  gcr.io/prysmaticlabs/prysm/validator:latest as builder



FROM alpine:latest

RUN mkdir -p /srv/rocketpool

RUN wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-cli-linux-amd64 -O /usr/local/bin/rocketpool

RUN wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-daemon-linux-amd64 -O /usr/local/bin/rocketpoold

RUN chmod +x /usr/local/bin/rocketpool /usr/local/bin/rocketpoold

COPY --from=builder /app/cmd/validator/validator /usr/local/bin/validator
#RUN wget https://github.com/prysmaticlabs/prysm/releases/download/v2.0.5/validator-v2.0.5-linux-amd64  -O /usr/local/bin/validator

RUN apk add supervisor gcompat

COPY config.yml /srv/rocketpool
COPY restart-validator.sh /srv/rocketpool
COPY settings.yml /srv/rocketpool
COPY supervisord.conf /etc
COPY test.sh /
COPY entrypoint.sh /

RUN chmod a+x /entrypoint.sh

ENTRYPOINT /entrypoint.sh

