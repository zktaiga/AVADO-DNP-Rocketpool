import React from "react";
import web3 from "web3";

const RegisterNode = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [transactionReceipt, setTransactionReceipt] = React.useState("");

    React.useEffect(() => {
        setButtonDisabled(true); //set default
        if (nodeStatus && !nodeStatus.registered) { // TODO: needs gas mony too ()
            rpdDaemon(`node can-register ${timeZone()}`, (data) => {
                if (data.canRegister)
                    setButtonDisabled(false);
            });
        }
    }, [nodeStatus]);


    // experiment with transaction feedback: 
    // The receipt is not available for pending transactions and returns null.
    // -> launch timer?
    React.useEffect(() => {
        const w3 = new web3('ws://goerli-geth.my.ava.do:8546');
        w3.eth.getTransactionReceipt("0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381").then((receipt) => {
            console.log(receipt);
            setTransactionReceipt(JSON.stringify(receipt));
        });
    },[]);

    const timeZone = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch (e) {
            return "Etc/UTC"; // Default: https://docs.rocketpool.net/guides/node/prepare-node.html#registering-your-node-with-the-network
        }
    }

    const registerNode = () => {
        rpdDaemon(`node register ${timeZone()}`, (data) => {
            updateNodeStatus();
            // txHash = data.txHash;
            // data.error
            //     "data": "{\"status\":\"success\",\"error\":\"\",\"txHash\":\"0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381\"}\n",
        });
    }


    return (
        <div>
            {transactionReceipt && (
                <p>DEBUG: receipt for "0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381" : {transactionReceipt}</p>
            )}
            {nodeStatus && !nodeStatus.registered && (
                <>
                    <h2 className="title is-3 has-text-white">Register Node</h2>
                    <button onClick={registerNode} disabled={buttonDisabled}>Register Node</button>
                </>
            )}
        </div>
    );
};

export default RegisterNode