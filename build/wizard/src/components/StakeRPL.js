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
                            setFeedback("");
                            setRplStakeButtonDisabled(false);
                        }
                    });
                }
            }
        }
        if (nodeStatus && nodeStatus.accountBalances && nodeStatus.accountBalances.rpl > 0 && rplPriceData) {
            // console.dir(nodeStatus.accountBalances.rpl)
            // console.dir(rplPriceData.maxPerMinipoolRplStake)

            // Use the deposited RPL amount (within limits)
            const selectedRplStake = BN.min(new BN(nodeStatus.accountBalances.rpl.toString()), new BN(rplPriceData.maxPerMinipoolRplStake.toString()));
            console.dir(selectedRplStake);
            // const selectedRplStake = nodeStatus.accountBalances.rpl;
            setSelectedRplStake(selectedRplStake.toString());
        }


    }, [nodeStatus, rplPriceData, rplAllowanceOK]);

    const stakeRpl = () => {
        confirmAlert({
            title: 'Are you sure you want to stake your RPL now?',
            message: 'Staking RPL consumes gas (ETH)',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setRplStakeButtonDisabled(true);
                        rpdDaemon(`node stake-rpl ${selectedRplStake}`, (data) => {
                            //{"status":"success","error":"","txHash":"0xcaeb805e3bbbc1f8c5334b595656c0d5b156a7e02d841ca14edfe3ff5983e349","minipoolAddress":"0xeb631532a78aa8abb3f3e2e5aab2c5e3025d0197","validatorPubkey":"80cf7ed9577f2cf860f0f03a6de4cae14a1b9f244e83ccaabf752c3a56c9a13c59e99566fe502dfa5fb95c22bc6de060","scrubPeriod":3600000000000}

                            if (data.status === "error") {
                                setFeedback(data.error);
                            }
                            updateNodeStatus();
                            setTxHash(data.txHash);
                            setWaitingForTx(true);
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
                        Stake {selectedRplStake ? displayAsETH(selectedRplStake) + " " : ""}RPL{waitingForTx ? <Spinner /> : ""}
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