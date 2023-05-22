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
    rpdDaemon: any,
}

const ExitMinipool = ({ minipool, rpdDaemon }: Props) => {
    const [feedback, setFeedback] = React.useState("");

    const confirmExit = () => {
        confirmAlert({
            title: '',
            message: `Are you sure you want to exit minipool ${minipool.address}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: triggerExit
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const triggerExit = () => {

        rpdDaemon(`minipool exit ${minipool.address} `, (data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            alert("Exit initiated.\nNote that it will take a while before the exit is complete.")
        })
    }

    if (!minipool.validator.active)
        return <></>

    return <>
        <div className="field">
            <button className="button" onClick={confirmExit}>Initiate validator exit</button>
        </div>
        {feedback && <p className="help is-danger">{feedback}</p>}
    </>;
}


export default ExitMinipool