import React from "react";
import { RestApi } from "./RestApi";
import { minipoolStatusType, nodeStatusType } from "./Types"
import { confirmAlert } from 'react-confirm-alert';
import Spinner from "./Spinner";
import web3 from "web3";
import { KeyManagerHelper } from "./KeyManagerHelper";

interface Props {
    rpdDaemon: any,
    utils: any,
    updateNodeStatus: any,
    minipoolSatus: minipoolStatusType,
    nodeStatus: nodeStatusType,
    keyManagerAPI: RestApi
}

const SmoothingPoolBanner = ({ rpdDaemon, utils, updateNodeStatus, nodeStatus, minipoolSatus, keyManagerAPI }: Props) => {

    // get-smoothing-pool-registration-status  Check whether or not the node is opted into the Smoothing Pool
    // ```
    // {
    //     "status": "success",
    //     "error": "",
    //     "nodeRegistered": true,
    //     "timeLeftUntilChangeable": -568920000000000
    //   }
    // ```
    // can-set-smoothing-pool-status           Check if the node's Smoothing Pool status can be changed
    // ```
    // {
    //     "status": "success",
    //     "error": "",
    //     "gasInfo": {
    //       "estGasLimit": 82132,
    //       "safeGasLimit": 123198
    //     }
    //   }
    // ```
    // set-smoothing-pool-status               Sets the node's Smoothing Pool opt-in status
    // ```
    // {
    //     "status": "success",
    //     "error": "",
    //     "txHash": "0xe110c58222dcd01c99fffa175a55ebb41b2dca3a45d808422b49998c38b756b2"
    //   }
    // ```

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

    const setFeeRecipients = async () => {
        const keyManagerHelper = new KeyManagerHelper(keyManagerAPI);
        minipoolSatus.minipools.forEach(minipool => {
            console.log("Setting fee recipient for", minipool.validatorPubkey)
            keyManagerHelper.setFeeRecipient("0x"+minipool.validatorPubkey, nodeStatus.feeRecipientInfo.smoothingPoolAddress)
        })
    }

    const joinSmoothingPool = () => {
        confirmAlert({
            title: '',
            message: 'Update now?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setupdateButtonEnabled(false);
                        rpdDaemon(`node set-smoothing-pool-status true`, (data: any) => {
                            if (data.status === "error") {
                                setFeedback(data.error);
                            }
                            setWaitingForTx(true);
                            setTxHash(data.txHash);
                            setFeedback("Waiting for transaction " + data.txHash);
                        })
                        setFeeRecipients()
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

    return (
        <>
            {nodeStatus && !nodeStatus.feeRecipientInfo.isInSmoothingPool && (
                <section className="hero is-danger">
                    <div className="hero-body is-small">
                        <p className="has-text-centered">Your RocketPool configuration needs an update!</p>
                        <div className="box has-text-centered">
                            <div className="content">
                                <p>RocketPool needs to update a smart contract to make your node ready for the merge.<br />
                                    Make sure your node has enough ETH to pay for the gas fees. (If gas fees are high at the moment, you can postpone this action, but make sure you do this before the merge.)</p>

                                <button className="button" onClick={joinSmoothingPool} disabled={!updateButtonEnabled}>Update {waitingForTx ? <Spinner /> : ""}</button>
                                {feedback && (
                                    <p className="help">{feedback}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default SmoothingPoolBanner


