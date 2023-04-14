import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import web3 from "web3";
import { rplPriceDataType, nodeStatusType } from "./Types"

interface Props {
    utils: any,
    rplAllowanceOK: boolean,
    setRplAllowanceOK: any
    rpdDaemon: any
}

const ApproveRpl = ({ utils, rplAllowanceOK, setRplAllowanceOK, rpdDaemon }: Props) => {
    const [rplApproveButtonDisabled, setRplApproveButtonDisabled] = React.useState(true);
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");

    React.useEffect(() => {
        checkAllowance();
    }, []);

    const checkAllowance = () => {
        setRplApproveButtonDisabled(false);

        rpdDaemon(`node stake-rpl-allowance`, (data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            } else {
                const allowance:bigint = BigInt(data.allowance)
                if (allowance > 0) {
                    setRplApproveButtonDisabled(true);
                    setRplAllowanceOK(true);
                } else {
                    setRplApproveButtonDisabled(false);
                    setRplAllowanceOK(false);
                }
            }
        });
    }

    const approveRpl = () => {
        const maxApproval:bigint = 2n**256n-1n

        confirmAlert({
            title: '',
            message: 'Are you sure you want to approve all RPL in your hot wallet to use as stake in your minipool?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => rpdDaemon(`node stake-rpl-approve-rpl ${maxApproval}`, (data: any) => {
                        if (data.status === "error") {
                            setFeedback(data.error);
                        }
                        setTxHash(data.approveTxHash);
                        setWaitingForTx(true);
                        setRplApproveButtonDisabled(true);
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
        if (waitingForTx && txHash) {
            rpdDaemon(`wait ${txHash}`, (data: any) => {
                const w3 = new web3(utils.wsProvider());
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    checkAllowance();
                });
            });
        }
    }, [waitingForTx, txHash, utils]);

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">1. Approve RPL</h4>
            {!rplAllowanceOK && (
                <>
                    <p>Approve the staking contract to use the RPL in your hot-wallet.</p>
                    <br />
                    <div className="field">
                        <button className="button"
                            onClick={approveRpl}
                            disabled={rplApproveButtonDisabled}>
                            Approve {waitingForTx ? <Spinner /> : ""}
                        </button>
                    </div>
                    <br />
                </>
            )}
            {feedback && (
                <p className="help is-danger">{feedback}</p>
            )}
            {rplAllowanceOK && (
                <span className="tag is-success">Approved <span><FontAwesomeIcon className="icon" icon={faCheck} /></span></span>
            )}
            {txHash && (
                <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
            )}
            <br />
            <br />
        </div>);
}


export default ApproveRpl