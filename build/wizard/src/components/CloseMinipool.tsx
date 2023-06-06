import React from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DownloadBackup from "./DownloadBackup";
import { rplPriceDataType, nodeStatusType, nodeFeeType, minipoolStatusType, MinipoolDetailsType } from "./Types"

interface Props {
    minipool: MinipoolDetailsType,
    updateMiniPoolStatus: any,
    utils: any,
    rpdDaemon: any,
}

const CloseMinipool = ({ minipool, utils, rpdDaemon, updateMiniPoolStatus }: Props) => {
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [waitingForTx, setWaitingForTx] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");
    const [txHash, setTxHash] = React.useState();


    const getBalance = () => BigInt(minipool.validator.balance ?? "0");
    const waitingBeforeCloseIsPossible = () => minipool.validator.exists && !minipool.validator.active && !minipool.finalised && getBalance() > 0n
    const canClose = () => minipool.status.status === "Dissolved" || (minipool.validator.exists && !minipool.validator.active && !minipool.finalised && getBalance() == 0n)

    const closeMinipool = () => {
        setButtonDisabled(true);

        rpdDaemon(`minipool close ${minipool.address} `, (data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            setWaitingForTx(true);

            setTxHash(data.txHash);
        })
    }

    React.useEffect(() => {
        if (waitingForTx && txHash) {
            rpdDaemon(`wait ${txHash}`, (data: any) => {
                const w3 = new web3(utils.wsProvider());
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    updateMiniPoolStatus();
                });
            });
        }
    }, [waitingForTx, txHash, utils]);


    if (waitingBeforeCloseIsPossible())
        return <><br />Waiting for final validator withdrawal, before this minipool can be closed</>

    if (!canClose())
        return <></>

    return <>
        <br />
        <p>Minipool can be closed:</p>
        <br />
        <div className="field">
            <button className="button" disabled={buttonDisabled} onClick={closeMinipool}>Close minipool {waitingForTx ? <Spinner /> : ""}</button>
        </div>
        {txHash && <p>{utils.etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>}
        {feedback && <p className="help is-danger">{feedback}</p>}
    </>;
}


export default CloseMinipool