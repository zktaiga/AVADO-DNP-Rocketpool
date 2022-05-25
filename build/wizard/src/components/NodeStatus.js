import React from "react";
import SyncStatusTag from "./SyncStatusTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

const NodeStatus = ({ utils, nodeStatus, updateNodeStatus, nodeSyncStatus }) => {
    //{"status":"success","error":"","eth1Progress":1,"eth2Progress":0.999965525074369,"eth1Synced":true,"eth2Synced":false,"eth1LatestBlockTime":1641917772}

    return (
        <div>
            <h2 className="title is-3 has-text-white">Node status</h2>
            {nodeStatus && (
                <div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><b>Geth execution node</b></td>
                                <td><SyncStatusTag progress={nodeSyncStatus.ecStatus.primaryEcStatus.isSynced?1.0:nodeSyncStatus.ecStatus.primaryEcStatus.syncProgress} label="ETH1" />&nbsp;</td>
                            </tr>
                            <tr>
                                <td><b>Beacon chain node</b></td>
                                <td><SyncStatusTag progress={nodeSyncStatus.eth2Progress} /></td>
                            </tr>
                            <tr>
                                <td><b>Hot wallet address</b></td>
                                <td>
                                    {utils.etherscanAddressUrl(nodeStatus.accountAddress)}{" "}
                                    <a href={"https://rocketscan.io/node/" + nodeStatus.accountAddress}><FontAwesomeIcon icon={faRocket} /></a>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Withdrawal address</b></td>
                                <td>
                                    {utils.etherscanAddressUrl(nodeStatus.withdrawalAddress)}{" "}
                                    <a href={"https://rocketscan.io/address/" + nodeStatus.withdrawalAddress}><FontAwesomeIcon icon={faRocket} /></a>
                                </td>
                            </tr>
                            <tr><td><b>RPL Stake</b></td><td>{utils.displayAsETH(nodeStatus.rplStake, 2)} RPL</td></tr>
                            <tr><td><b>RPL Stake</b></td><td>{utils.displayAsETH(nodeStatus.rplStake, 2)} RPL</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NodeStatus