import React from "react";

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
            {nodeStatus&& (
                <div>
                    <table className="table">
                        <tbody>
                            <tr><td><b>Geth node synced</b></td><td>{parseFloat(nodeSyncStatus.eth1Progress * 100).toFixed(2) + "%"}</td></tr>
                            <tr><td><b>Beacon chain node synced</b></td><td>{parseFloat(nodeSyncStatus.eth2Progress * 100).toFixed(2) + "%"}</td></tr>
                            <tr><td><b>Account Address</b></td><td>{nodeStatus.accountAddress}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NodeStatus