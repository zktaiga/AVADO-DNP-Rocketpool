import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { minipoolStatusType, nodeStatusType } from "./Types"
import { KeyManagerHelper } from "./KeyManagerHelper"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import BN from "bn.js"

interface Props {
    utils: any,
    rpdDaemon: any,
    restake: boolean,
    unclaimedIntervals: number[],
    claimRPl?: BN
}

const ClaimRewardsButton = ({ utils, rpdDaemon, restake, unclaimedIntervals, claimRPl = new BN(0) }: Props) => {
    const [buttonEnabled, setButtonEnabled] = React.useState(false);
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();

    const checkCommand = () => restake ?
        "can-claim-and-stake-rewards " + unclaimedIntervals.join(",") + " " + claimRPl
        : "can-claim-rewards " + unclaimedIntervals.join(",")
    const command = () => restake ?
        "claim-and-stake-rewards " + unclaimedIntervals.join(",") + " " + claimRPl
        : "claim-rewards " + unclaimedIntervals.join(",")
    const message = () => restake ? "Claim and restake RPL rewards" : "Claim all rewards"

    React.useEffect(() => {
        if (waitingForTx)
            return;

        setButtonEnabled(false); //set default
        // console.log(checkCommand())

        if (unclaimedIntervals && unclaimedIntervals.length > 0) {
            rpdDaemon(`node ` + checkCommand(), (data: any) => {
                if (data.status === "error") {
                    setFeedback(data.error);
                } else {
                    setFeedback("");
                    setButtonEnabled(true);
                }
            });

        }
    }, [waitingForTx, rpdDaemon, unclaimedIntervals]);

    const claim = () => {
        console.log(command())

        confirmAlert({
            title: '',
            message: message(),
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setButtonEnabled(false);
                        rpdDaemon(`node ` + command(), (data: any) => {
                            //{"status":"success","error":"","txHash":"0x9e1401966779de0c896b33027272fc466d59503c69954111e0e00111582ee2e5"}
                            if (data.status === "error") {
                                setFeedback(data.error);
                                return
                            }
                            setWaitingForTx(true);
                            setTxHash(data.txHash);
                            setFeedback("Waiting for onchain transaction.");
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
                });
            });
        }
    }, [waitingForTx, txHash, utils, rpdDaemon]);


    return (
        <div>
            <div className="field">
                <button className="button" onClick={claim} disabled={!buttonEnabled}>
                    {waitingForTx ? <Spinner /> : message()}
                </button>
            </div>
            {feedback && (
                <p className="help">{feedback}</p>
            )}
            {txHash && (
                <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
            )}

        </div>
    );
};

export default ClaimRewardsButton