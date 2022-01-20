import React from 'react';
import web3 from "web3";
import config from "../config";

export const beaconChainBaseUrl = ({
    "prater": "https://prater.beaconcha.in/",
    "mainnet": "https://beaconcha.in/",
})[process.env.NETWORK] || "https://prater.beaconcha.in/"

export const etherscanBaseUrl = ({
    "prater": "https://goerli.etherscan.io",
    "mainnet": "https://etherscan.io",
})[process.env.NETWORK] || "https://goerli.etherscan.io"

export function beaconchainUrl(validatorPubkey, text) {
    return <a href={beaconChainBaseUrl + "/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
}

export function etherscanAddressUrl(address, text) {
    return <a href={etherscanBaseUrl+"/address/" + address}>{text ? text : address}</a>;
}

export function etherscanTransactionUrl(txHash, text) {
    return <a href={etherscanBaseUrl+"/tx/" + txHash}>{text ? text : txHash}</a>;
}

// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
export function displayAsETH(number, fractionDigits) {
    if (!number)
        return 0;
    const result = web3.utils.fromWei(String(number), 'ether');
    if (fractionDigits)
        return parseFloat(result).toFixed(fractionDigits)
    return result
}

export function displayAsPercentage(number) {
    if (!number)
        return "- %";
    return parseFloat(number).toFixed(2) + "%";
}
