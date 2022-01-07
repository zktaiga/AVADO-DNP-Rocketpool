import React from "react";

const RegisterNode = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    React.useEffect(() => {
        setButtonDisabled(true); //set default
        if (nodeStatus && !nodeStatus.registered) {
            setButtonDisabled(false);
        }
    }, [nodeStatus]);

    const timeZone = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch (e) {
            return "Etc/UTC"; // Default: https://docs.rocketpool.net/guides/node/prepare-node.html#registering-your-node-with-the-network
        }
    }

    const registerNode = () => {
        rpdDaemon(`node register ${timeZone()}`, (res) => {
            console.log(res);
            const data = JSON.parse(res.data);
            updateNodeStatus();
            // txHash = data.txHash;
            // data.error
            //     "data": "{\"status\":\"success\",\"error\":\"\",\"txHash\":\"0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381\"}\n",
        });
    }

    return (
        <div>
            {nodeStatus && (
                <>
                    <h2 className="title is-3 has-text-white">Register Node</h2>
                    <button onClick={registerNode} disabled={buttonDisabled}>Register Node</button>
                </>
            )}
        </div>
    );
};

export default RegisterNode