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

// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
export function displayAsETH(number, fractionDigits) {
    if (!number)
        return 0;
    const result = web3.utils.fromWei(String(number), 'ether');
    if  (fractionDigits)
        return parseFloat(result).toFixed(fractionDigits)
    return result
}

export function displayAsPercentage(number) {
    if (!number)
        return "- %";
    return parseFloat(number).toFixed(2) + "%";
}
