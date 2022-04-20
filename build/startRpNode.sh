#!/bin/bash

NETWORK=${NETWORK}
CONSENSUSCLIENT=${CONSENSUSCLIENT}

if [ "${NETWORK}" = "prater" ]; then
    ECHTTPURL="http://goerli-geth.my.ava.do:8545"
    ECWSURL="ws://goerli-geth.my.ava.do:8546"
else
    ECHTTPURL="http://ethchain-geth.my.ava.do:8545"
    ECWSURL="http://ethchain-geth.my.ava.do:8546"
fi

if [ "${CONSENSUSCLIENT}" = "teku" ]; then
    BCHTTPURL="http://teku.my.ava.do:5051"
    BCJSONRPCURL=""
else
    BCHTTPURL="http://prysm-beacon-chain-${NETWORK}.my.ava.do:3500"
    BCJSONRPCURL="http://prysm-beacon-chain-${NETWORK}.my.ava.do:4000"
fi

NETWORK="${NETWORK}" \
CONSENSUSCLIENT="${CONSENSUSCLIENT}" \
ECHTTPURL="${ECHTTPURL}" \
ECWSURL="${ECWSURL}" \
BCHTTPURL="${BCHTTPURL}" \
BCJSONRPCURL="${BCJSONRPCURL}" \
    envsubst <$(dirname "$0")/user-settings.template >$(dirname "$0")/user-settings.yml

# Start RocketPool node daemon
/usr/local/bin/rocketpoold --settings /srv/rocketpool/user-settings.yml node
