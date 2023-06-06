import React from "react";
import web3 from "web3";
import Spinner from "./Spinner";
import ApproveRpl from "./ApproveRpl";
import StakeRPL from "./StakeRPL";
import DepositETH from "./DepositETH";
import DownloadBackup from "./DownloadBackup";
import { rplPriceDataType, nodeStatusType, nodeFeeType } from "./Types"
import MiniPoolStatus from "./MiniPoolStatus";

export type minipoolSizeType = 16 | 8

interface Props {
    minipoolSize: minipoolSizeType,
    targetCount: number
    utils: any,
    nodeStatus: nodeStatusType,
    rplPriceData: rplPriceDataType,
    updateNodeStatus: any,
    updateMiniPoolStatus: any,
    nodeFee: nodeFeeType,
    rpdDaemon: any,
    setNavBar: any
}

const CreateMinipoolSteps = ({ minipoolSize, targetCount, utils, nodeStatus, rplPriceData, updateNodeStatus, updateMiniPoolStatus, nodeFee, rpdDaemon, setNavBar }: Props) => {
    const [rplAllowanceOK, setRplAllowanceOK] = React.useState(false);

    return (

        <div>
            <p>Create a minipool. This involves 3 steps</p>
            <br />
            <div>
                <ApproveRpl utils={utils} rplAllowanceOK={rplAllowanceOK} setRplAllowanceOK={setRplAllowanceOK} rpdDaemon={rpdDaemon} />
                <StakeRPL
                    minipoolSize={minipoolSize}
                    targetCount={targetCount}
                    utils={utils}
                    nodeStatus={nodeStatus}
                    rplPriceData={rplPriceData}
                    rplAllowanceOK={rplAllowanceOK}
                    updateNodeStatus={updateNodeStatus}
                    rpdDaemon={rpdDaemon}
                />
                <DepositETH
                    minipoolSize={minipoolSize}
                    targetCount={targetCount}
                    utils={utils}
                    nodeStatus={nodeStatus}
                    nodeFee={nodeFee}
                    rplPriceData={rplPriceData}
                    rplAllowanceOK={rplAllowanceOK}
                    updateNodeStatus={updateNodeStatus}
                    updateMiniPoolStatus={updateMiniPoolStatus}
                    rpdDaemon={rpdDaemon}
                    setNavBar={setNavBar}
                />
            </div>
        </div>
    )
};

export default CreateMinipoolSteps