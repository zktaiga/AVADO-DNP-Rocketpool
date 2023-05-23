import React from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DownloadBackup from "./DownloadBackup";
import { rplPriceDataType, nodeStatusType, nodeFeeType } from "./Types"
import { minipoolSizeType } from "./CreateMinipoolSteps";

interface Props {
    minipoolSize: minipoolSizeType,
    utils: any,
    nodeStatus: nodeStatusType,
    nodeFee: nodeFeeType,
    rplPriceData: rplPriceDataType,
    rplAllowanceOK: any,
    updateNodeStatus: any,
    setNavBar: any,
    updateMiniPoolStatus: any,
    targetCount: number
    rpdDaemon: any,
}

const DepositETH = ({ minipoolSize, utils, nodeStatus, nodeFee, rplPriceData, rplAllowanceOK, updateNodeStatus, rpdDaemon, setNavBar, updateMiniPoolStatus, targetCount }: Props) => {

    const [ethButtonDisabled, setEthButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [selectedNodeFee, setSelectedNodeFee] = React.useState<number>();

    const minMinipoolRplStake = minipoolSize === 8 ? rplPriceData.minPer8EthMinipoolRplStake : rplPriceData.minPer16EthMinipoolRplStake

    const ETHDepositAmount: bigint = BigInt(minipoolSize) * 1000000000000000000n

    const getNodeFeeWithSlippage = (nodeFee: number) => nodeFee * 1.0; // no more slippage

    const rplMin = BigInt(minMinipoolRplStake) + BigInt(nodeStatus.minimumRplStake);

    React.useEffect(() => {
        if (waitingForTx)
            return;

        setEthButtonDisabled(true); //set default
        if (nodeStatus && rplPriceData && rplAllowanceOK) {
            const stakedRplBalance: bigint = BigInt(nodeStatus.rplStake)

            if (stakedRplBalance < rplMin) {
                setFeedback("You need to stake RPL first")
            } else {
                if (BigInt(nodeStatus.accountBalances.eth) < ETHDepositAmount) {
                    setFeedback(`There is not enough ETH in your wallet. You need at least ${minipoolSize} ETH + gas.`)
                } else {
                    rpdDaemon(`node can-deposit ${ETHDepositAmount} ${selectedNodeFee} 0`, (data: any) => {
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

        if (nodeFee && nodeFee?.status === "success" && !selectedNodeFee) {
            setSelectedNodeFee(getNodeFeeWithSlippage(nodeFee.nodeFee));
        }

    }, [nodeStatus, rplPriceData, rplAllowanceOK, nodeFee, waitingForTx]);


    React.useEffect(() => {
        if (waitingForTx && txHash) {
            rpdDaemon(`wait ${txHash}`, (data: any) => {
                const w3 = new web3(utils.wsProvider());
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    updateNodeStatus();
                    updateMiniPoolStatus();
                });
            });
        }
    }, [waitingForTx, txHash, utils]);

    const depositEth = () => {
        confirmAlert({
            title: '',
            message: `Are you sure you want to deposit your ${minipoolSize} ETH and create your minipool?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setEthButtonDisabled(true);
                        rpdDaemon(`node deposit ${ETHDepositAmount} ${selectedNodeFee} 0 false true`, (data: any) => {  //   rocketpool api node deposit amount min-fee salt use-credit-balance submit
                            //{"status":"success","error":"","txHash":"0x6c8958917414479763aaa65dbff4b00e52d9ef699d64dbd0827a45e1fe8aee38","minipoolAddress":"0xc43a2d435bd48bde1e000c07e89f3e6ebe9161d4","validatorPubkey":"ac9cb87a11fd8c55a9529108964786f11623717a6e3af0db3cd5fde2da5c6a7a4f89e52d13770ad6bc080de1b63427a1","scrubPeriod":3600000000000}
                            if (data.status === "error") {
                                setFeedback(data.error);
                            }
                            setWaitingForTx(true);
                            setTxHash(data.txHash);
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

    if (!nodeStatus || !nodeFee) {
        return null;
    }

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">3. Deposit {minipoolSize} ETH and create MiniPool</h4>
            {nodeStatus.minipoolCounts.total >= targetCount && (
                <>
                    <span className="tag is-success">{minipoolSize} ETH successfully deposited. <span><FontAwesomeIcon className="icon" icon={faCheck} /></span></span>
                    <br />
                </>
            )}

            {nodeFee.status === "success" && nodeStatus.minipoolCounts.total < targetCount && selectedNodeFee && (
                <>
                    <p>The commission you will receive from other deposits is {utils.displayAsPercentage(selectedNodeFee * 100)}.<br />For more info on this check the <a target="_blank" href="https://wiki.ava.do/en/tutorials/rocketpool">Avado Rocket Pool Wiki page</a></p>
                    <br />
                    <div className="field">
                        <button className="button" onClick={depositEth} disabled={ethButtonDisabled}>Deposit {minipoolSize} ETH and create minipool {waitingForTx ? <Spinner /> : ""}</button>
                    </div>
                    {feedback && (
                        <p className="help is-danger">{feedback}</p>
                    )}
                    <br />
                </>
            )}
            {txHash && !waitingForTx && (
                <>
                    <br />
                    <p>Your MiniPool has been successfully created! Click the button below to go to the status page.</p>
                    <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
                    <br />
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <article className="message is-warning ">
                                <div className="message-header">
                                    <p>Download backup</p>
                                </div>
                                <div className="message-body">
                                    <p>Please download a backup of your whole minipool configuration now!</p>
                                    <DownloadBackup />
                                </div>
                            </article>
                        </div>
                    </div>
                    <br />
                    <p>
                        <button className="button" onClick={() => {
                            updateMiniPoolStatus();
                            updateNodeStatus();
                            setNavBar("Status");
                        }} >Go to the status page</button>
                    </p>
                    <br />
                </>
            )}
        </div>);
}


export default DepositETH