import React from "react";
import web3 from "web3";

const SetWithdrawalAddress = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [withdrawalAddress, setWithdrawalAddress] = React.useState("");
    const [addressFeedback, setAddressFeedback] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(false);


    //web3.utils.isAddress(address)
    //web3.eth.ens.getAddress(ENSName);

    React.useEffect(() => {
        //rpdDaemon(`node can-set-withdrawal-address ${withdrawalAddress} yes`)
        if (web3.utils.isAddress(withdrawalAddress)) {
            setAddressFeedback("Address looks OK");
            setButtonDisabled(false);
        } else {
            setAddressFeedback("Invalid ETH address");
            setButtonDisabled(true);
        }
    }, [withdrawalAddress]);

    const onClick = () => {
        rpdDaemon(`node set-withdrawal-address ${withdrawalAddress} yes`, (res) => {
            const data = JSON.parse(res.data);
            console.log(res);
            if (data.status === "error") {
                setAddressFeedback(data.error);
            }
            //"{"status":"success","error":"","txHash":"0x27f5b5bb3905cd135cdef17e71f6f9ac70e3e95fd372999cb4eea918f3990310"}
            updateNodeStatus();
        });
    }


    // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
    return (
        <div>
            <h2 className="title is-3 has-text-white">Withdrawal address</h2>
            {nodeStatus && nodeStatus.withdrawalAddress !== nodeStatus.accountAddress &&(
                <div>
                    <p><b>Hot wallet address:</b> {nodeStatus.accountAddress}</p>
                    <p><b>Withdrawal address:</b> {nodeStatus.withdrawalAddress}</p>
                </div>
            )}
            {nodeStatus && nodeStatus.withdrawalAddress === nodeStatus.accountAddress && (
                <>
                    <p>Hotwallet too risky ({nodeStatus.accountAddress}), so you must configure a withdrawal address. All gains will be deposited to this address.</p>
                    <p>TODO: extra info about procedure</p>
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
                        <button onClick={onClick} disabled={buttonDisabled}>Set withdrawal address</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SetWithdrawalAddress