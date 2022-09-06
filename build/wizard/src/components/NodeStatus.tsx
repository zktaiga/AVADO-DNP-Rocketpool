import React from "react";
import SyncStatusTag from "./SyncStatusTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { networkType, consusClientType, minipoolStatusType, nodeStatusType } from "./Types"


interface Props {
    rpdDaemon: any,
    utils: any,
    updateNodeStatus: any,
    nodeStatus: nodeStatusType,
    nodeSyncStatus: any
}

const NodeStatus = ({ utils, nodeStatus, updateNodeStatus, nodeSyncStatus }: Props) => {
    return (
        <div>
            <h2 className="title is-3 has-text-white">Node status</h2>
            {nodeStatus && (
                <div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><b>Execution (ETH1) node</b></td>
                                <td><SyncStatusTag progress={nodeSyncStatus.ecStatus.primaryEcStatus.syncProgress} /></td>
                            </tr>
                            <tr>
                                <td><b>Beacon chain (ETH2) node</b></td>
                                <td><SyncStatusTag progress={nodeSyncStatus.bcStatus.primaryEcStatus.syncProgress} /></td>
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
                            <tr><td><b>Time zone</b></td><td>{nodeStatus.timezoneLocation}</td></tr>
                            <tr><td><b>Smoothing pool joined</b></td><td>{nodeStatus.feeRecipientInfo.isInSmoothingPool ? "yes" : "no"}</td></tr>
                            <tr><td><b>Fee Distributor Initialized</b></td><td>{nodeStatus.isFeeDistributorInitialized ? "yes" : "no"}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NodeStatus