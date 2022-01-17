import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import config from "../config";

import spinner from "../assets/spinner.svg";

import { etherscanTransactionUrl } from './utils.js';

const RegisterNode = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [transactionReceipt, setTransactionReceipt] = React.useState("");
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);

    React.useEffect(() => {
        setButtonDisabled(true); //set default
        if (waitingForTx)
            return;
        if (nodeStatus && !nodeStatus.registered && nodeStatus.accountBalances.eth > 0) {
            rpdDaemon(`node can-register ${timeZone()}`, (data) => {
                if (data.canRegister)
                    setButtonDisabled(false);
            });
        }
    }, [nodeStatus]);

    React.useEffect(() => {
        if (waitingForTx) {
            rpdDaemon(`wait ${txHash}`, (data) => {
                const w3 = new web3(config.wsProvider);
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setTransactionReceipt(JSON.stringify(receipt));
                    setWaitingForTx(false);
                });
            });
        }

    }, [waitingForTx]);

    const timeZone = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch (e) {
            return "Etc/UTC"; // Default: https://docs.rocketpool.net/guides/node/prepare-node.html#registering-your-node-with-the-network
        }
    }

    const registerNode = () => {
        confirmAlert({
            title: 'Registering a node consumes gas (ETH).',
            message: 'Are you sure you want to continue?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => rpdDaemon(`node register ${timeZone()}`, (data) => {
                        // "data": "{\"status\":\"success\",\"error\":\"\",\"txHash\":\"0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381\"}\n",
                        updateNodeStatus();
                        setTxHash(data.txHash);
                        setWaitingForTx(true);
                        setButtonDisabled(true);
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    return (
        <div>
            {nodeStatus && !nodeStatus.registered && (
                <>
                    <h2 className="title is-3 has-text-white">Register Node</h2>
                    <button className="button" onClick={registerNode} disabled={buttonDisabled}>Register Node</button>
                    {waitingForTx && (
                        <p><span className="icon"><img alt="spinner" src={spinner} /></span></p>
                    )}
                    {txHash && (
                        <p>{etherscanTransactionUrl(txHash, "Transaction details on Etherscan")}</p>
                    )}
                    {transactionReceipt && (
                        <p>Transaction receipt" : {transactionReceipt}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default RegisterNode