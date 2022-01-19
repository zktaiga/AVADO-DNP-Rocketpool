import React from "react";
import BN from "bn.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import config from "../config";
import { etherscanTransactionUrl, displayAsETH } from './utils.js';
import web3 from "web3";

const StakeRPL = ({ nodeStatus, rplPriceData, rplAllowanceOK, updateNodeStatus, rpdDaemon }) => {

    const [rplStakeButtonDisabled, setRplStakeButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [selectedRplStake, setSelectedRplStake] = React.useState();

    React.useEffect(() => {
        setRplStakeButtonDisabled(true); //set default

        if (nodeStatus && rplPriceData && rplAllowanceOK) {
            if (nodeStatus.accountBalances.rpl < rplPriceData.minPerMinipoolRplStake) {
                setFeedback(`Not enough RPL in your wallet (${displayAsETH(nodeStatus.accountBalances.rpl, 4)} RPL). Must be more than ${displayAsETH(rplPriceData.minPerMinipoolRplStake, 4)} RPL before you can stake`);
            } else {
                if (nodeStatus.rplStake === 0) {
                    rpdDaemon(`node can-stake-rpl ${selectedRplStake}`, (data) => {
                        //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
                        if (data.status === "error") {
                            setFeedback(data.error);
                        } else {
                            setRplStakeButtonDisabled(false);
                        }
                    });
                }
            }
        }
        if (nodeStatus) {
            // Use the deposited RPL amount (within limits)
            const selectedRplStake = BN.min(new BN(nodeStatus.accountBalances.rpl), rplPriceData.maxPerMinipoolRplStake);
            // const selectedRplStake = nodeStatus.accountBalances.rpl;
            setSelectedRplStake(selectedRplStake);
        }


    }, [nodeStatus, rplPriceData, rplAllowanceOK]);

    const stakeRpl = () => {
        confirmAlert({
            title: 'Are you sure you want to stake your RPL now?',
            message: 'Staking RPL consumes gas (ETH)',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => rpdDaemon(`node stake-rpl ${selectedRplStake}`, (data) => {
                        if (data.status === "error") {
                            setFeedback(data.error);
                        }
                        updateNodeStatus();
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

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

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">Stake RPL</h4>
            {nodeStatus.rplStake > 0 && (
                <p>
                    {displayAsETH(nodeStatus.rplStake, 4)} RPL successfully staked.

                </p>
            )}
            {nodeStatus.rplStake === 0 && (
                <div className="field">
                    <button
                        className="button"
                        onClick={stakeRpl}
                        disabled={rplStakeButtonDisabled}>
                        Stake RPL{waitingForTx ? <Spinner /> : ""}
                    </button>
                    {feedback && (
                        <p className="help is-danger">{feedback}</p>
                    )}
                </div>
            )}
            {txHash && (
                <p>{etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
            )}
        </div>);
}


export default StakeRPL