import React from "react";
import BN from "bn.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import config from "../config";
import { etherscanTransactionUrl, displayAsETH, displayAsPercentage } from './utils.js';
import web3 from "web3";

const DepositETH = ({ nodeStatus, nodeFee, rplPriceData, rplAllowanceOK, updateNodeStatus, rpdDaemon }) => {


    const [ethButtonDisabled, setEthButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [selectedNodeFee, setSelectedNodeFee] = React.useState();
    const ETHDepositAmmount = 16000000000000000000;

    React.useEffect(() => {
        setEthButtonDisabled(true); //set default
        if (nodeStatus && rplPriceData && rplAllowanceOK) {
            if (nodeStatus.rplStake < rplPriceData.minPerMinipoolRplStake) {
                setFeedback("You need to stake RPL first")
            } else {
                if (nodeStatus.accountBalances.eth / 1000000000000000000 < 16) {
                    setFeedback("There is not enough ETH in your wallet. You need at least 16 ETH + gas.")
                } else {
                    rpdDaemon(`node can-deposit ${ETHDepositAmmount} ${selectedNodeFee} 0`, (data) => {
                        if (data.status === "error") {
                            setFeedback(data.error);
                        } else {
                            setFeedback("");
                            setEthButtonDisabled(false);
                        }
                    });
                }
            }
        }

        if (nodeFee && nodeFee.nodeFee && !selectedNodeFee) {
            setSelectedNodeFee(nodeFee.nodeFee * 0.97); // allow 3% slippage by default
        }


    }, [nodeStatus, rplPriceData, rplAllowanceOK, nodeFee, rplAllowanceOK]);


    React.useEffect(() => {
        if (waitingForTx) {
            rpdDaemon(`wait ${txHash}`, (data) => {
                const w3 = new web3(config.wsProvider);
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                });
            });
        }
    }, [waitingForTx]);

    const depositEth = () => {
        confirmAlert({
            title: 'Are you sure you want to deposit your 16 ETH now?',
            message: 'Staking RPL consumes gas (ETH)',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => rpdDaemon(`node deposit ${ETHDepositAmmount} ${selectedNodeFee} 0`, (data) => {  //   rocketpool api node deposit amount min-fee salt
                        if (data.status === "error") {
                            setFeedback(data.error);
                        }
                        updateNodeStatus();
                        setTxHash(data.approveTxHash);
                        setWaitingForTx(true);
                        setEthButtonDisabled(true);
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const slider = (e) => {
        setSelectedNodeFee(e.target.value);
    }

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">Deposit ETH</h4>
            {nodeStatus && nodeStatus.minipoolCounts.total > 0 && (
                <>
                <p>16 ETH successfully deposited.</p>
                </>
            )}

            {nodeStatus && nodeStatus.minipoolCounts.total == 0 && (
                <>
                    <div className="field">
                        Your minimal nodeFee: <input id="sliderWithValue" className="slider has-output" step="0.01" min={nodeFee.minNodeFee} max={nodeFee.maxNodeFee} defaultValue={nodeFee.nodeFee} type="range" onChange={slider} />
                        {displayAsPercentage(selectedNodeFee * 100)}
                    </div>
                    <div className="field">
                        <button className="button" onClick={depositEth} disabled={ethButtonDisabled}>Deposit 16 ETH{waitingForTx ? <Spinner /> : ""}</button>
                    </div>
                    {feedback && (
                        <p className="help is-danger">{feedback}</p>
                    )}
                </>
            )}
            {txHash && (
                <p>{etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
            )}
        </div>);
}


export default DepositETH