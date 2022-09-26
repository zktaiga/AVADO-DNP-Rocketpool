import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { minipoolStatusType, nodeStatusType } from "./Types"
import { KeyManagerHelper } from "./KeyManagerHelper"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import config from "../config";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";
import Spinner from "./Spinner";
import RpdCommand from "./RpdCommand";
import { domainToUnicode } from "url";
import ClaimRewardsButtons from "./ClaimRewardsButtons";
import BN from "bn.js"

interface Props {
    utils: any,
    rpdDaemon: any,
}

// https://github.com/rocket-pool/smartnode/blob/master/rocketpool-cli/node/rewards.go
const RewardsPage = ({ utils, rpdDaemon }: Props) => {

    // https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/node.go#L260
    type nodeRewardsType = {
        "status": "success" | "error",
        "error": string,
        "nodeRegistrationTime": string,
        "rewardsInterval": number,
        "lastCheckpoint": string,
        "trusted": boolean,
        "registered": boolean,
        "effectiveRplStake": number
        "totalRplStake": number
        "trustedRplBond": number
        "estimatedRewards": number
        "cumulativeRplRewards": number
        "cumulativeEthRewards": number
        "estimatedTrustedRplRewards": number
        "cumulativeTrustedRplRewards": number
        "unclaimedRplRewards": number
        "unclaimedEthRewards": number
        "unclaimedTrustedRplRewards": number
        "beaconRewards": number
        "txHash": string
    }

    type rewardsInfoType = {
        "status": string,
        "error": string
        "claimedIntervals": [any]
        "unclaimedIntervals": [{
            "index": number,
            "collateralRplAmount": number
        }]
        "invalidIntervals": [any]
        "rplStake": number,
        "rplPrice": number,
        "activeMinipools": number
    }

    const [nodeRewards, setNodeRewards] = React.useState<nodeRewardsType>();
    const [rewardsInfo, setRewardsInfo] = React.useState<rewardsInfoType>();
    const [unclaimedIntervals, setUnclaimedIntervals] = React.useState<number[]>([]);
    const [claimRPl, setClaimRPl] = React.useState<BN>(new BN(0));

    React.useEffect(() => {
        if (rpdDaemon) {
            rpdDaemon(`node rewards`, (data: nodeRewardsType) => setNodeRewards(data));
            rpdDaemon(`node get-rewards-info`, (data: rewardsInfoType) => {
                setRewardsInfo(data)
                const unclaimedIntervals = data.unclaimedIntervals.map(ui => ui.index)
                setUnclaimedIntervals(unclaimedIntervals)

                setClaimRPl(data.unclaimedIntervals.reduce((prev, ui) => prev.add(new BN(ui.collateralRplAmount)), new BN(0)))
            });
        }
    }, [rpdDaemon]);

    if (!nodeRewards || !rewardsInfo) {
        return (
            <div>
                Fetching data...
            </div>
        )
    } else if (nodeRewards?.status == "error") {
        return (
            <div>
                Error : {nodeRewards.error}
            </div>
        )
    } else return (
        <div>
            <h2 className="title is-3 has-text-white">Ethereum rewards</h2>
            <div className="content">
                <p>
                    You have earned <b>{nodeRewards.beaconRewards.toFixed(4)} ETH</b> from the Beacon Chain (including your commissions) so far.
                    <br />
                    You have claimed <b>{nodeRewards.cumulativeEthRewards.toFixed(4)} ETH</b> from the Smoothing Pool.
                    <br />
                    You still have <b>{nodeRewards.unclaimedEthRewards.toFixed(4)} ETH</b> in unclaimed Smoothing Pool rewards.
                </p>


                <h2 className="title is-3 has-text-white">RPL rewards</h2>
                <div className="content"></div>
                <p>
                    The current rewards cycle started on {nodeRewards.lastCheckpoint}.
                    <br />
                    {/* It will end on 28 Sep 22 01:26 UTC (35h57m5s from now). */}
                    You currently have <b>{nodeRewards.unclaimedRplRewards.toFixed(4)} unclaimed RPL</b> from staking rewards.
                </p>
                <p>
                    Your estimated RPL staking rewards for this cycle: <b>{nodeRewards.estimatedRewards.toFixed(4)} RPL</b> (this may change based on network activity).
                    <br />
                    Based on your current total stake of <b>{nodeRewards.totalRplStake.toFixed(4)} RPL</b>, this is approximately {
                        (nodeRewards.estimatedRewards / nodeRewards.totalRplStake / nodeRewards.rewardsInterval * (1_000_000_000 * 60 * 60) * (24 * 365) * 100).toFixed(2)
                    }% APR.
                    <br />
                    Your node has received <b>{nodeRewards.cumulativeRplRewards.toFixed(4)} RPL</b> staking rewards in total.
                </p>
            </div>

            <h2 className="title is-3 has-text-white">Claim</h2>
            <div className="content">
                <p>
                    You may claim these rewards at any time. You no longer need to claim them within this interval.
                </p>
                <ul>
                    <li>ETH: <b>{nodeRewards.unclaimedEthRewards.toFixed(4)} ETH</b></li>
                    <li>RPL: <b>{nodeRewards.unclaimedRplRewards.toFixed(4)} RPL</b></li>
                </ul>
                <ClaimRewardsButtons utils={utils} rpdDaemon={rpdDaemon} unclaimedIntervals={unclaimedIntervals} claimRPl={claimRPl} />
            </div>
        </div >
    );
};

export default RewardsPage