import React from 'react';
import web3 from "web3";

export function beaconchainUrl(validatorPubkey, text) {
    return <a href={"https://prater.beaconcha.in/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
}

export function etherscanAddressUrl(address, text) {
    return <a href={"https://goerli.etherscan.io/address/" + address}>{text ? text : address}</a>;
}

export function etherscanTransactionUrl(txHash, text) {
    return <a href={"https://goerli.etherscan.io/tx/" + txHash}>{text ? text : txHash}</a>;
}

export function displayAsETH(number) {
    if (!number)
        return "---";
    return web3.utils.fromWei(String(number), 'ether');
}