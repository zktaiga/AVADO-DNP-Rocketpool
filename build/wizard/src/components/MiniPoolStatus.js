import React from "react";
import { beaconchainUrl, etherscanAddressUrl, displayAsETH } from './utils.js';
import beaconchainlogo from "../assets/beaconchain.png";

const MiniPoolStatus = ({ minipoolStatus }) => {

    const miniPoolSteps = [
        "Initializing",
        "Prelaunch",
        "Staking",
        "Exited"
    ];

    const isHollow = (step, minipool) => {
        if (step === "Staking")
            return !minipool.validator.active;
        return false;
    
    }
    const miniPoolStepsComment = (step) => {
        if (step === "Prelaunch") return "(~12 hours)";
        else return "";
    };
    
    // https://docs.rocketpool.net/guides/node/create-validator.html#depositing-eth-and-creating-a-minipool
    //minipool status: initialized -> prelaunch (currently 12 hours) -> staking

    // https://kb.beaconcha.in/ethereum-2.0-depositing

    if (!minipoolStatus || !minipoolStatus.minipools)
        return (
            <>
            </>
        );
    const minipool0 = minipoolStatus.minipools[0];
    return (
        <div>
            <h2 className="title is-3 has-text-white">Minipool status</h2>
            {minipool0 && minipool0.status && (
                <div> {/* https://octoshrimpy.github.io/bulma-o-steps/ */}
                    <div className="columns">
                        <div className="column">
                            <ul className="steps has-content-centered">
                                {miniPoolSteps.map( (element) => 
                                    <li className={"steps-segment" + (element === minipool0.status.status ? " is-active" : "")} key={element}>
                                        <span className={"steps-marker"+ (element === minipool0.status.status && isHollow(element, minipool0)?" is-hollow":"")}></span>
                                        <div className="steps-content">
                                            <p className="is-size-4 has-text-white">{element}</p>
                                            <div className="extra-data has-text-white">{miniPoolStepsComment(element)}</div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {beaconchainUrl(minipool0.validator.index, <img src={beaconchainlogo} alt="More info on beaconcha.in" />)}

                    <table className="table">
                        <tbody>
                            <tr><td><b>Address</b></td><td>{etherscanAddressUrl(minipool0.address)}</td></tr>
                            <tr><td><b>Status updated</b></td><td>{minipool0.status.statusTime}</td></tr>
                            <tr><td><b>Node fee</b></td><td>{parseFloat(minipool0.node.fee * 100).toFixed(2) + "%"}</td></tr>
                            <tr><td><b>Node deposit</b></td><td>{displayAsETH(minipool0.node.depositBalance)} ETH</td></tr>
                            <tr><td><b>RP ETH assigned</b></td><td>{minipool0.user.depositAssignedTime}</td></tr>
                            <tr><td><b>RP deposit</b></td><td>{displayAsETH(minipool0.node.depositBalance)} ETH</td></tr>
                            <tr><td><b>Validator pubkey</b></td><td>{beaconchainUrl(minipool0.validatorPubkey, "0x" + minipool0.validatorPubkey.substring(0, 20) + "..." + minipool0.validatorPubkey.substring(76))}</td></tr>
                            <tr><td><b>Validator index</b></td><td>{beaconchainUrl(minipool0.validator.index)}</td></tr>
                            <tr><td><b>Validator active</b></td><td>{minipool0.validator.active ? "yes" : "no"}</td></tr>
                            <tr><td><b>Validator balance</b></td><td>{displayAsETH(minipool0.validator.balance)}</td></tr>
                            <tr><td><b>Expected rewards</b></td><td>{displayAsETH(minipool0.validator.nodeBalance)}</td></tr>
                        </tbody>
                    </table>
                    <br />
                    <table className="table">
                        <tbody>
                            <tr><td><b>Use latest delegate</b></td><td>{minipool0.useLatestDelegate ? "yes" : "no"}</td></tr>
                            <tr><td><b>Delegate address</b></td><td>{etherscanAddressUrl(minipool0.delegate)}</td></tr>
                            <tr><td><b>Effective delegate</b></td><td>{etherscanAddressUrl(minipool0.effectiveDelegate)}</td></tr>
                        </tbody>
                    </table>
                    <p>{beaconchainUrl(minipool0.validatorPubkey, "More validator info on the Ethereum 2.0 Beacon Chain Explorer")}</p>
                </div>
            )}
        </div>
    );
};

export default MiniPoolStatus