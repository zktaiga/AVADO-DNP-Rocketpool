import React from "react";
import PropTypes from "prop-types";


const MiniPoolStatus = ({ minipools }) => {
    function beaconchainUrl(validatorPubkey, text) {
        return <a href={"https://prater.beaconcha.in/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
    }

    function etherscanUrl(address, text) {
        return <a href={"https://goerli.etherscan.io/address/" + address}>{text ? text : address}</a>;
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
        <div>
            <h2>Minipool status</h2>
            <table>
                <tbody>
                    <tr><td><b>Address</b></td><td>{etherscanUrl(minipool0.address)}</td></tr>
                    <tr><td><b>Status updated</b></td><td>{minipool0.status.statusTime}</td></tr>
                    <tr><td><b>Node fee</b></td><td>{parseFloat(minipool0.node.fee * 100).toFixed(2) + "%"}</td></tr>
                    <tr><td><b>Node deposit</b></td><td>{displayAsETH(minipool0.node.depositBalance)}</td></tr>
                    <tr><td><b>RP ETH assigned</b></td><td>{minipool0.user.depositAssignedTime}</td></tr>
                    <tr><td><b>RP deposit</b></td><td>{displayAsETH(minipool0.node.depositBalance)}</td></tr>
                    <tr><td><b>Validator pubkey</b></td><td>{beaconchainUrl(minipool0.validatorPubkey, minipool0.validatorPubkey.substring(0, 6) + "..." + minipool0.validatorPubkey.substring(90))}</td></tr>
                    <tr><td><b>Validator index</b></td><td>{beaconchainUrl(minipool0.validator.index)}</td></tr>
                    <tr><td><b>Validator active</b></td><td>{minipool0.validator.active ? "yes" : "no"}</td></tr>
                    <tr><td><b>Validator balance</b></td><td>{displayAsETH(minipool0.validator.balance)}</td></tr>
                    <tr><td><b>Expected rewards</b></td><td>{displayAsETH(minipool0.validator.nodeBalance)}</td></tr>
                </tbody>
            </table>
            <br />
            <table>
                <tbody>
                    <tr><td><b>Use latest delegate</b></td><td>{minipool0.useLatestDelegate ? "yes" : "no"}</td></tr>
                    <tr><td><b>Delegate address</b></td><td>{etherscanUrl(minipool0.delegate)}</td></tr>
                    <tr><td><b>Effective delegate</b></td><td>{etherscanUrl(minipool0.effectiveDelegate)}</td></tr>
                </tbody>
            </table>
            <p>{beaconchainUrl(minipool0.validatorPubkey, "More validator info on the Ethereum 2.0 Beacon Chain Explorer")}</p>
        </div>
    );
};

export default MiniPoolStatus