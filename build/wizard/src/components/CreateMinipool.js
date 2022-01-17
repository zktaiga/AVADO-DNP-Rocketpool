import React from "react";
import web3 from "web3";

const CreateMinipool = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {
    const minNodeFee = 0.05;
    const maxNodeFee = 0.2;

    const [rplApproveButtonDisabled, setRplApproveButtonDisabled] = React.useState(true);
    const [rplStakeButtonDisabled, setRplStakeButtonDisabled] = React.useState(true);
    const [ethButtonDisabled, setEthButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");
    const [currentNodeFee, setCurrentNodeFee] = React.useState(maxNodeFee);

    // can-stake-rpl                   Check whether the node can stake RPL
    // stake-rpl-approve-rpl, k1       Approve RPL for staking against the node
    // wait-and-stake-rpl, k2          Stake RPL against the node, waiting for approval tx-hash to be mined first
    // get-stake-rpl-approval-gas      Estimate the gas cost of new RPL interaction approval
    // stake-rpl-allowance             Get the node's RPL allowance for the staking contract
    // stake-rpl, k3                   Stake RPL against the node

    // can-deposit                     Check whether the node can make a deposit
    // deposit, d                      Make a deposit and create a minipool

    React.useEffect(() => {
        if (nodeStatus) {
            rpdDaemon(`network node-fee`, (data) => {
                if (data.status === "error") {
                    setFeedback(data.error);
                } else {
                    setCurrentNodeFee(data.nodeFee);
                    console.assert(data.minNodeFee, minNodeFee);
                    console.assert(data.maxNodeFee, maxNodeFee);
                }
            });
        }
    }, [nodeStatus]);

    React.useEffect(() => {
        setRplApproveButtonDisabled(false); // -> `node stake-rpl-allowance` ?
        setRplStakeButtonDisabled(true); //set default
        setEthButtonDisabled(true); //set default
        if (nodeStatus) {

            if (nodeStatus.accountBalances.eth / 1000000000000000000 >= 16)
                rpdDaemon(`node can-deposit 16000000000000000000 ${currentNodeFee} 0`, (data) => {
                    //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
                    if (data.status === "error") {
                        setFeedback(data.error);
                    } else {
                        setEthButtonDisabled(false);
                    }
                });

            //node can-stake-rpl 199 ???

            if (nodeStatus.accountBalances.rpl / 1000000000000000000 >= 199) //TODO calculate this number
                if (nodeStatus.rplStake < 199000000000000000000) {
                    rpdDaemon(`node can-stake-rpl 199000000000000000000`, (data) => {
                        //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
                        if (data.status === "error") {
                            setFeedback(data.error);

                        } else {
                            setRplStakeButtonDisabled(false);
                        }
                    });
                }




            //TODO: restart validator in supervisord (automatic via node process or explicit via monitor?)
            // 2022/01/10 10:11:17 Restarting validator container (rocketpool_validator)...
            // 2022/01/10 10:11:17 Could not get docker containers: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?


//             2022/01/12 15:29:33 Checking for minipools to launch...
// 2022/01/12 15:29:33 1 minipool(s) are ready for staking...
// 2022/01/12 15:29:33 Staking minipool 0x8fF39674619F5fd2a243C86425a15afD1712Fd1B...
// 2022/01/12 15:29:33 Current network gas price is 157.80 Gwei, which is higher than the set threshold of 150.00 Gwei. Aborting the transaction.
// 2022/01/12 15:29:33 Time until staking will be forced for safety: 137h34m3.716961291s
// 2022/01/12 15:31:42 Checking for minipools to launch...
// 2022/01/12 15:31:42 1 minipool(s) are ready for staking...
// 2022/01/12 15:31:42 Staking minipool 0x8fF39674619F5fd2a243C86425a15afD1712Fd1B...
// 2022/01/12 15:31:42 This transaction will use a gas price of 231.078523 Gwei, for a total of 0.061025 to 0.091537 ETH.
// 2022/01/12 15:31:42 Transaction has been submitted with hash 0xc96bd610fc749e4e3320bf4ec6d0583bbc5d049e7b0987dcc9fb0436bf940e65.
// 2022/01/12 15:31:42 You may follow its progress by visiting:
// 2022/01/12 15:31:42 https://goerli.etherscan.io/tx/0xc96bd610fc749e4e3320bf4ec6d0583bbc5d049e7b0987dcc9fb0436bf940e65

// 2022/01/12 15:31:42 Waiting for the transaction to be mined...
// 2022/01/12 15:31:48 Successfully staked minipool 0x8fF39674619F5fd2a243C86425a15afD1712Fd1B.
// 2022/01/12 15:31:48 Restarting validator container (rocketpool_validator)...
// 2022/01/12 15:31:48 Could not get docker containers: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?


        }
    }, [nodeStatus, currentNodeFee]);

    const approveRpl = () => {
        rpdDaemon(`node stake-rpl-approve-rpl 199000000000000000000`, (data) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const stakeRpl = () => {
        rpdDaemon(`node stake-rpl 199000000000000000000`, (data) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const depositEth = () => {
        rpdDaemon(`node deposit 16000000000000000000 ${currentNodeFee} 0`, (data) => {  //   rocketpool api node deposit amount min-fee salt
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
                            <p><b>Current Node fee: </b>{currentNodeFee} (Minimum: {minNodeFee}, maximum: {maxNodeFee})</p>
                        </div>
                        <div className="field">
                            <button className="button" onClick={approveRpl} disabled={rplApproveButtonDisabled}>Approve RPL</button>
                        </div>
                        <div className="field">
                            <button className="button" onClick={stakeRpl} disabled={rplStakeButtonDisabled}>Stake RPL</button>
                        </div>
                        <div className="field">
                            <button className="button" onClick={depositEth} disabled={ethButtonDisabled}>Stake 16 ETH</button>
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