import React from "react";
import PropTypes from "prop-types";


const MiniPoolStatus = ({ minipools }) => {
    function beaconchainUrl(validatorPubkey, text) {
        return <a href={"https://prater.beaconcha.in/validator/" + validatorPubkey + "#rocketpool"}>{text?text:validatorPubkey}</a>;
    }

    function etherscanUrl(address,text) {
        return <a href={"https://goerli.etherscan.io/address/" + address }>{text?text:address}</a>;
    }

    function displayAsETH(number) {
        return (number / 1000000000000000000) + " ETH";
    }

    if (!minipools)
    return (
        <>
            </>
        );
    const minipool0 = minipools[0];
    return (
        <>
            <h1>Minipool status</h1>
            <ul>
                <li><b>Address:</b> {etherscanUrl(minipool0.address)}</li>
                <li><b>Status updated:</b> {minipool0.status.statusTime}</li>
                <li><b>Node fee:</b> {parseFloat(minipool0.node.fee*100).toFixed(2)+"%"}</li>
                <li><b>Node deposit:</b> {displayAsETH(minipool0.node.depositBalance)}</li>
                <li><b>RP ETH assigned:</b> {minipool0.user.depositAssignedTime}</li>
                <li><b>RP deposit:</b> {displayAsETH(minipool0.node.depositBalance)}</li>
                <li><b>Validator pubkey:</b> {beaconchainUrl(minipool0.validatorPubkey)}</li>
                <li><b>Validator index:</b> {beaconchainUrl(minipool0.validator.index)}</li>
                <li><b>Validator active:</b> {minipool0.validator.active?"yes":"no"}</li>
                <li><b>Validator balance:</b> {displayAsETH(minipool0.validator.balance)}</li>
                <li><b>Expected rewards:</b> {displayAsETH(minipool0.validator.nodeBalance)}</li>
                
                <li><b>Use latest delegate:</b> {minipool0.useLatestDelegate?"yes":"no"}</li>
                <li><b>Delegate address:</b> {etherscanUrl(minipool0.delegate)}</li>
                <li><b>Effective delegate:</b> {etherscanUrl(minipool0.effectiveDelegate)}</li>
            </ul>
            <p>{beaconchainUrl(minipool0.validatorPubkey,"More validator info on the Ethereum 2.0 Beacon Chain Explorer")}</p>
        </>
    );
};

export default MiniPoolStatus