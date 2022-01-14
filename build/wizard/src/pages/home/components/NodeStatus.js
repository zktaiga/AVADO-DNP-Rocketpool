import React from "react";
import { beaconchainUrl, etherscanAddressUrl, displayAsETH } from './utils.js';
import SyncStatusTag from "./SyncStatusTag";


const NodeStatus = ({ nodeStatus, updateNodeStatus, nodeSyncStatus, updateNodeSyncStatus }) => {
    // const [nodeSync, setNodeSync] = useState();
    //{"status":"success","error":"","eth1Progress":1,"eth2Progress":0.999965525074369,"eth1Synced":true,"eth2Synced":false,"eth1LatestBlockTime":1641917772}

    // React.useEffect(() => {
    //     const timer = setTimeout(() => {
    //         console.log("Trigger update");
    //         updateNodeStatus();
    //         updateNodeSyncStatus();
    //     }, [5000]); //refresh every 5 seconds
    // });

    return (
        <div>
            <h2 className="title is-3 has-text-white">Node status</h2>
            {nodeStatus && (
                <div>
                    {/* <div className="columns">
                        <div className="column is-4">
                            <div className="card is-primary">
                                <div className="card-header-title">Node status</div>
                                <div className="card-content">
                                    <table className="table">
                                        <tbody>
                                            <tr><td><b>Geth node synced</b></td><td>
                                                <span className={"tag" + (nodeSyncStatus.eth1Progress == 1 ? " is-success" : " is-warning")}>
                                                    {parseFloat(nodeSyncStatus.eth1Progress * 100).toFixed(2) + "% synced"}
                                                </span>
                                            </td></tr>
                                            <tr><td><b>Beacon chain node synced</b></td><td>
                                                <span className={"tag" + (nodeSyncStatus.eth2Progress == 1 ? " is-success" : " is-warning")}>
                                                    {parseFloat(nodeSyncStatus.eth2Progress * 100).toFixed(2) + "% synced"}
                                                </span>
                                            </td></tr>
                                            <tr><td><b>Account Address</b></td><td>{etherscanAddressUrl(nodeStatus.accountAddress)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div> */}


                    <table className="table">
                        <tbody>
                            <tr>
                                <td><b>Geth execution node</b></td>                                
                                <td><SyncStatusTag progress={nodeSyncStatus.eth1Progress} /></td>
                            </tr>
                            <tr>
                                <td><b>Beacon chain node</b></td>
                                <td><SyncStatusTag progress={nodeSyncStatus.eth2Progress} /></td>
                            </tr>
                            <tr><td><b>Account Address</b></td><td>{etherscanAddressUrl(nodeStatus.accountAddress)}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NodeStatus