import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { minipoolStatusType, nodeStatusType } from "./Types"
import { KeyManagerHelper } from "./KeyManagerHelper"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";

interface Props {
    utils: any,
    nodeStatus: nodeStatusType,
    updateNodeStatus: any,
    rpdDaemon: any,
}

const JoinSmoothingPool = ({ utils, nodeStatus, updateNodeStatus, rpdDaemon }: Props) => {
    const [updateButtonEnabled, setupdateButtonEnabled] = React.useState(false);
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();

    React.useEffect(() => {
        if (waitingForTx)
            return;

        setupdateButtonEnabled(false); //set default
        if (nodeStatus && !nodeStatus.feeRecipientInfo.isInSmoothingPool) {
            rpdDaemon(`node can-set-smoothing-pool-status true`, (data: any) => {
                if (data.status === "error") {
                    setFeedback(data.error);
                } else {
                    setFeedback("");
                    setupdateButtonEnabled(true);
                }
            });
        }

    }, [nodeStatus, waitingForTx, rpdDaemon]);

    const joinSmoothingPool = () => {
        confirmAlert({
            title: '',
            message: 'Join smoothing pool',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setupdateButtonEnabled(false);
                        rpdDaemon(`node set-smoothing-pool-status true`, (data: any) => {
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
                    updateNodeStatus();
                });
            });
        }
    }, [waitingForTx, txHash, utils, rpdDaemon]);


    if (!(nodeStatus)) {
        return <></>
    }
    return (
        <div>
            <h2 className="title is-3 has-text-white">Withdrawal address</h2>
            <>
                <p>Next step is joining the "Smoothing Pool".
                </p>
                <br />
                <div className="field">
                    <button className="button" onClick={joinSmoothingPool} disabled={!updateButtonEnabled}>
                        {waitingForTx ? <Spinner /> : "Join"}
                    </button>
                </div>
                {feedback && (
                    <p className="help">{feedback}</p>
                )}
                {txHash && (
                    <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
                )}
            </>
        </div>
    );
};

export default JoinSmoothingPool