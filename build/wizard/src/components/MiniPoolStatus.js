import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

const MiniPoolStatus = ({ utils, minipoolStatus }) => {
    const miniPoolSteps = [
        "Initializing",
        "Prelaunch",
        "Minipool active",
        // "Exited"
    ];

    const isHollow = (step, minipool) => {
        if (step === "Minipool active")
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

    // {"status":"success","error":"","minipools":[{"address":"0x990074a02a06c27b9e13869cfe937efaa0de0b92","validatorPubkey":"996a3d7f3da4c6ed02f66243b849c10feaae37c38bb9be8657d8647216997b9a19827bdb20dde6b412453512770c2900","status":{"status":"Minipool active","statusBlock":6233072,"statusTime":"2022-01-20T10:01:08Z"},"depositType":"Full","node":{"address":"0x1192b62c60aad67a89196a0cefd42ed85d27506e","fee":0.16840959301290093,"depositBalance":16000000000000000000,"refundBalance":16000000000000000000,"depositAssigned":true},"user":{"depositBalance":16000000000000000000,"depositAssigned":true,"depositAssignedTime":"2022-01-10T13:47:50Z"},"balances":{"eth":16000000000000000000,"reth":0,"rpl":0,"fixedSupplyRpl":0},"validator":{"exists":true,"active":false,"index":271831,"balance":32000000000000000000,"nodeBalance":16000000000000000000},"refundAvailable":true,"withdrawalAvailable":false,"closeAvailable":false,"finalised":false,"useLatestDelegate":false,"delegate":"0xc6b40c1a317144a09c303c504cb525ee68ab8c8e","previousDelegate":"0x0000000000000000000000000000000000000000","effectiveDelegate":"0xc6b40c1a317144a09c303c504cb525ee68ab8c8e"}],"latestDelegate":"0xc6b40c1a317144a09c303c504cb525ee68ab8c8e"}



    if (!minipoolStatus || !minipoolStatus.minipools)
        return (
            <>
            </>
        );
    return (
        <div>
            {minipoolStatus.minipools.map((minipool, index) => {
                if (!minipool.status)
                    return <></>
                else
                    return <div key={`minipool${index + 1}`}> {/* https://octoshrimpy.github.io/bulma-o-steps/ */}
                        <h3 className="title is-3 has-text-white">Minipool {index + 1}</h3>
                        <div className="columns">
                            <div className="column">
                                <ul className="steps has-content-centered">
                                    {miniPoolSteps.map((element) =>
                                        <li className={"steps-segment" + (element === minipool.status.status ? " is-active" : "")} key={element}>
                                            <span className={"steps-marker" + (element === minipool.status.status && isHollow(element, minipool) ? "" : "")}></span>
                                            <div className="steps-content">
                                                <p className="is-size-4 has-text-white">{element}</p>
                                                <div className="extra-data has-text-white">{miniPoolStepsComment(element)}</div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* {utils.beaconchainUrl(minipool0.validator.index, <img src={beaconchainlogo} alt="More info on beaconcha.in" />)} */}

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><b>Minipool address</b></td>
                                    <td>
                                        {utils.etherscanAddressUrl(minipool.address)}{" "}
                                        <a href={"https://rocketscan.io/minipool/" + minipool.address}><FontAwesomeIcon icon={faRocket} /></a>
                                    </td>
                                </tr>
                                <tr><td><b>Status updated</b></td><td>{minipool.status.statusTime}</td></tr>
                                <tr><td><b>Node fee</b></td><td>{utils.displayAsPercentage(minipool.node.fee * 100)}</td></tr>
                                <tr><td><b>Node deposit</b></td><td>{utils.displayAsETH(minipool.node.depositBalance)} ETH</td></tr>
                                <tr><td><b>RP ETH assigned</b></td><td>{minipool.user.depositAssignedTime}</td></tr>
                                <tr><td><b>RP deposit</b></td><td>{utils.displayAsETH(minipool.user.depositBalance)} ETH</td></tr>
                                <tr><td><b>Validator pubkey</b></td><td>{utils.beaconchainUrl(minipool.validatorPubkey, "0x" + minipool.validatorPubkey.substring(0, 20) + "..." + minipool.validatorPubkey.substring(76))}</td></tr>
                                <tr><td><b>Validator index</b></td><td>{minipool.validator.index !== 0 ? utils.beaconchainUrl(minipool.validator.index) : "n/a"}</td></tr>
                                <tr><td><b>Validator active</b></td><td>{minipool.validator.active ? "yes" : "no"}</td></tr>
                                <tr><td><b>Validator balance</b></td><td>{utils.displayAsETH(minipool.validator.balance)}</td></tr>
                                <tr><td><b>Expected rewards</b></td><td>{utils.displayAsETH(minipool.validator.nodeBalance)}</td></tr>
                            </tbody>
                        </table>
                        <br />
                        <table className="table">
                            <tbody>
                                <tr><td><b>Use latest delegate</b></td><td>{minipool.useLatestDelegate ? "yes" : "no"}</td></tr>
                                <tr><td><b>Delegate address</b></td><td>{utils.etherscanAddressUrl(minipool.delegate)}</td></tr>
                                <tr><td><b>Effective delegate</b></td><td>{utils.etherscanAddressUrl(minipool.effectiveDelegate)}</td></tr>
                            </tbody>
                        </table>
                        <p>{utils.beaconchainUrl(minipool.validatorPubkey, "More validator info on the Ethereum 2.0 Beacon Chain Explorer")}</p>
                    </div>

            }
            )}




        </div>
    );
};

export default MiniPoolStatus