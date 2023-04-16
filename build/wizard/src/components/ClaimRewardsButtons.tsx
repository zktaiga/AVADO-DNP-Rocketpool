import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";


interface Props {
    utils: any,
    rpdDaemon: any,
    unclaimedIntervals: number[],
    claimRPl: bigint
    onRewardsClaimFinished: () => void
}

const ClaimRewardsButtons = ({ utils, rpdDaemon, unclaimedIntervals, claimRPl, onRewardsClaimFinished }: Props) => {
    const [claimButtonEnabled, setClaimButtonEnabled] = React.useState(false);
    const [restakeButtonEnabled, setRestakeButtonEnabled] = React.useState(false);
    const [claimFeedback, setClaimFeedback] = React.useState("");
    const [restakeFeedback, setRestakeFeedback] = React.useState("");

    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [txHash, setTxHash] = React.useState();

    const checkCommand = (restake: boolean) => restake ?
        "can-claim-and-stake-rewards " + unclaimedIntervals.join(",") + " " + claimRPl
        : "can-claim-rewards " + unclaimedIntervals.join(",")
    const command = (restake: boolean) => restake ?
        "claim-and-stake-rewards " + unclaimedIntervals.join(",") + " " + claimRPl
        : "claim-rewards " + unclaimedIntervals.join(",")
    const message = (restake: boolean) => restake ? "Claim and restake RPL rewards" : "Claim all rewards"

    React.useEffect(() => {
        if (waitingForTx)
            return;

        setClaimButtonEnabled(false); //set default
        setRestakeButtonEnabled(false); //set default
        // console.log(checkCommand())

        if (unclaimedIntervals && unclaimedIntervals.length > 0) {
            rpdDaemon(`node ` + checkCommand(false), (data: any) => {
                if (data.status === "error") {
                    setClaimFeedback(data.error);
                } else {
                    setClaimFeedback("");
                    setClaimButtonEnabled(true);
                }
            });
            rpdDaemon(`node ` + checkCommand(true), (data: any) => {
                if (data.status === "error") {
                    setRestakeFeedback(data.error);
                } else {
                    setRestakeFeedback("");
                    setRestakeButtonEnabled(true);
                }
            });

        }
    }, [waitingForTx, rpdDaemon, unclaimedIntervals]);

    const claim = (restake: boolean) => {
        console.log(command(restake))

        confirmAlert({
            title: '',
            message: message(restake),
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setClaimButtonEnabled(false);
                        setRestakeButtonEnabled(false);
                        rpdDaemon(`node ` + command(restake), (data: any) => {
                            //{"status":"success","error":"","txHash":"0x9e1401966779de0c896b33027272fc466d59503c69954111e0e00111582ee2e5"}
                            if (data.status === "error") {
                                restake ? setClaimFeedback(data.error) : setRestakeFeedback(data.error);
                                return
                            }
                            setWaitingForTx(true);
                            setTxHash(data.txHash);
                            const feedback = "Waiting for onchain transaction."
                            restake ? setClaimFeedback(feedback) : setRestakeFeedback(feedback);
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    React.useEffect(() => {
        if (waitingForTx && txHash) {
            rpdDaemon(`wait ${txHash}`, (data: any) => {
                const w3 = new web3(utils.wsProvider());
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    onRewardsClaimFinished()
                    setClaimFeedback("")
                    setRestakeFeedback("")
                });
            });
        }
    }, [waitingForTx, txHash, utils, rpdDaemon]);


    return (
        <div>
            <div className="field">
                <button className="button" onClick={() => claim(false)} disabled={!claimButtonEnabled}>
                    {waitingForTx ? <Spinner /> : message(false)}
                </button> or
                <button className="button" onClick={() => claim(true)} disabled={!restakeButtonEnabled}>
                    {waitingForTx ? <Spinner /> : message(true)}
                </button>
            </div>
            {claimFeedback && (
                <p className="help">{claimFeedback}</p>
            )}
            {restakeFeedback && (
                <p className="help">{restakeFeedback}</p>
            )}
            {txHash && (
                <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
            )}

        </div>
    );
};

export default ClaimRewardsButtons