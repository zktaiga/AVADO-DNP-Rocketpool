import React from "react";
import web3 from "web3";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import config from "../../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { etherscanTransactionUrl } from './utils.js';


const SetWithdrawalAddress = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [withdrawalAddress, setWithdrawalAddress] = React.useState("");
    const [addressFeedback, setAddressFeedback] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [transactionReceipt, setTransactionReceipt] = React.useState("");
    const [txHash, setTxHash] = React.useState();
    const [waitingForTx, setWaitingForTx] = React.useState(false);



    React.useEffect(() => {
        //rpdDaemon(`node can-set-withdrawal-address ${withdrawalAddress} yes`)
        if (web3.utils.isAddress(withdrawalAddress)) {
            setAddressFeedback("Address looks OK");
            setButtonDisabled(false);
        } else {
            setAddressFeedback("Invalid ETH address");
            setButtonDisabled(true);
        }
        if (waitingForTx)
            return;
        if (nodeStatus) {
            // rpdDaemon(`node can-set-withdrawal-address ${withdrawalAddress} yes`, (data) => {
            //     if (data.canRegister)
            //         setButtonDisabled(false);
            // });
        }
    }, [nodeStatus, withdrawalAddress]);

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

    const onClick = () => {
        confirmAlert({
            title: 'Are you sure you want to continue?',
            message: `Double check the withdrawal address (${withdrawalAddress}), if you make a mistake here, you loose control.
             Note that this action consumes gas (ETH).`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => rpdDaemon(`node set-withdrawal-address ${withdrawalAddress} yes`, (data) => {
                        if (data.status === "error") {
                            setAddressFeedback(data.error);
                        }
                        //"{"status":"success","error":"","txHash":"0x27f5b5bb3905cd135cdef17e71f6f9ac70e3e95fd372999cb4eea918f3990310"}
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


    // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
    return (
        <div>
            <h2 className="title is-3 has-text-white">Withdrawal address</h2>
            {nodeStatus && nodeStatus.withdrawalAddress !== nodeStatus.accountAddress && (
                <div>
                    <p><b>Hot wallet address:</b> {nodeStatus.accountAddress}</p>
                    <p><b>Withdrawal address:</b> {nodeStatus.withdrawalAddress}</p>
                </div>
            )}
            {nodeStatus && nodeStatus.withdrawalAddress === nodeStatus.accountAddress && (
                <>
                    <p>For security reasons you need to set a <b>withdrawal address</b> for your node.
                        This is the address that all of your RPL checkpoint rewards, your staked RPL, and your Beacon Chain ETH
                        will be sent to when you claim your checkpoint rewards or exit your validator and withdraw from your minipool.
                    </p>
                    <p>This withdrawal address must be a cold wallet that you control, such as a MetaMask address or a hardware wallet.</p>
                    <p>This way, if your node wallet is compromised, the attacker doesn't get access to your staked ETH and RPL by forcing
                        you to exit because all of those funds will be sent to your separate cold wallet (which they hopefully do not have).</p>
                    <p>Withdrawal addresses are set at a node operator level. If you create multiple minipools they will all refer to the same withdrawal address. So you only need to perform this setup once.
                    </p>
                    <p className="WARNING">Once you have set the withdrawal address, this rocket pool node can no longer change it.
                        To change it, you will need to send a signed transaction from your active withdrawal address. The Rocket Pool website has a function to help you do this.
                    </p>
                    <div>
                        <div className="field">
                            <label className="label">Withdrawal address</label>
                            <p className="help">This is the address TODO (example: "0x9b18e9e9aa3dD35100b385b7035C0B1E44AfcA14"</p>
                        </div>
                        <div className="field has-addons">
                            <input className="input" onChange={(e) => { setWithdrawalAddress(e.target.value) }} />
                        </div>
                        {withdrawalAddress && (
                            <p className="help is-danger">{addressFeedback}</p>
                        )}
                    </div>
                    <div className="field">
                        <button className="button" onClick={onClick} disabled={buttonDisabled}>
                            {waitingForTx ? <FontAwesomeIcon className="icon fa-spin" icon={faSpinner} /> : "Set withdrawal address"}
                        </button>
                    </div>
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

export default SetWithdrawalAddress