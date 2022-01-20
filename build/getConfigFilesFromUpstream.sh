#!/bin/bash

mkdir -p tmp
pushd tmp
wget -nc https://github.com/rocket-pool/smartnode-install/releases/latest/download/rp-smartnode-install-amd64.tar.xz
tar -xvf rp-smartnode-install-amd64.tar.xz
popd
if [ ! -d "prater" ]; then
    cp -r tmp/amd64/rp-smartnode-install/network/prater .
fi
if [ ! -d "mainnet" ]; then
    cp -r tmp/amd64/rp-smartnode-install/network/mainnet .
fi

