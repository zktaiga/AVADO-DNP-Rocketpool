ARG PRYSM_VERSION=latest
ARG RP_VERSION=v1.1.2

# TODO run this in builder

FROM rocketpool/smartnode:${RP_VERSION} as rocketpool

# RUN mkdir -p /.rocketpool/
# RUN wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rp-smartnode-install-amd64.tar.xz
# # TODO mainnet
# RUN tar -xvf rp-smartnode-install-amd64.tar.xz amd64/rp-smartnode-install/network/prater
# RUN mv amd64/rp-smartnode-install/network/prater /.rocketpool
# RUN ls /.rocketpool

COPY prater/ /.rocketpool/

# COPY --from=rocketpool /go/bin/rocketpool /go/bin/rocketpool

#COPY --from=prysm /app/cmd/validator/validator /bin/validator

