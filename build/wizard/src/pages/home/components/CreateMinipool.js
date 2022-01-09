import React from "react";
import web3 from "web3";

const CreateMinipool = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const [rplButtonDisabled, setRplButtonDisabled] = React.useState(true);
    const [ethButtonDisabled, setEthButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");

    // can-stake-rpl                   Check whether the node can stake RPL
    // stake-rpl-approve-rpl, k1       Approve RPL for staking against the node
    // wait-and-stake-rpl, k2          Stake RPL against the node, waiting for approval tx-hash to be mined first
    // get-stake-rpl-approval-gas      Estimate the gas cost of new RPL interaction approval
    // stake-rpl-allowance             Get the node's RPL allowance for the staking contract
    // stake-rpl, k3                   Stake RPL against the node
    
    // can-deposit                     Check whether the node can make a deposit
    // deposit, d                      Make a deposit and create a minipool



    React.useEffect(() => {
        setEthButtonDisabled(true); //set default
        setRplButtonDisabled(true); //set default
        if (nodeStatus) {
            // rpdDaemon(`can-deposit 16000000000000000000 0.2 0`, (res) => {
            //     //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
            //     const data = JSON.parse(res.data);
            //     console.log(res);
            //     if (data.status === "error") {
            //         setFeedback(data.error);
            //     }
            // });

            //node can-stake-rpl 199 ???

            // rpdDaemon(`can-stake-rpl 199000000000000000000`, (res) => {
            //     //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
            //     const data = JSON.parse(res.data);
            //     console.log(res);
            //     if (data.status === "error") {
            //         setFeedback(data.error);
            //     }
            // });


            //TODO: restart validator in supervisord (via monitor)

            if (nodeStatus.accountBalances.eth / 1000000000000000000 >= 16)
                setEthButtonDisabled(false);
            if (nodeStatus.accountBalances.rpl / 1000000000000000000 >= 199) //TODO calculate this number
                setRplButtonDisabled(false);
        }
    }, [nodeStatus]);

    const stakeRpl = () => {
        // rpdDaemon(`node stake-rpl-approve-rpl 199000000000000000000`, (res) => {
        rpdDaemon(`node stake-rpl 199000000000000000000`, (res) => {
            const data = JSON.parse(res.data);
            console.log(res);
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const depositEth = () => {
        rpdDaemon(`node deposit 16000000000000000000 .2 0`, (res) => {  //   rocketpool api node deposit amount min-fee salt
            const data = JSON.parse(res.data);
            console.log(res);
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    return (
        <div>
            {nodeStatus && (
                <>
                    <h2 className="title is-3 has-text-white">Create minipool</h2>
                    <p>TODO: extra info about procedure</p>
                    <div>
                        <div className="field">
                            <button onClick={stakeRpl} disabled={rplButtonDisabled}>Stake RPL</button>
                        </div>
                        <div className="field">
                            <button onClick={depositEth} disabled={ethButtonDisabled}>Stake 16 ETH</button>
                        </div>
                        {feedback && (
                            <p className="help is-danger">{feedback}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateMinipool