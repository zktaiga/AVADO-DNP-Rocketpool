import React from "react";
import web3 from "web3";
import Spinner from "./Spinner";
import { displayAsPercentage, displayAsETH } from "./utils";

const CreateMinipool = ({ nodeStatus, rplPriceData, updateNodeStatus, rpdDaemon }) => {
    const minNodeFee = 0.05;
    const maxNodeFee = 0.2;

    const [rplApproveButtonDisabled, setRplApproveButtonDisabled] = React.useState(true);
    const [rplStakeButtonDisabled, setRplStakeButtonDisabled] = React.useState(true);
    const [ethButtonDisabled, setEthButtonDisabled] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");
    const [networkNodeFee, setNetworkNodeFee] = React.useState();
    const [selectedNodeFee, setSelectedNodeFee] = React.useState();
    const [selectedRplStake, setSelectedRplStake] = React.useState();

    const ETHDepositAmmount = 16000000000000000000;

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
                    setNetworkNodeFee(data.nodeFee);
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
        if (nodeStatus && rplPriceData) {

            if (nodeStatus.accountBalances.eth / 1000000000000000000 >= 16)
                rpdDaemon(`node can-deposit ${ETHDepositAmmount} ${selectedNodeFee} 0`, (data) => {
                    //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
                    if (data.status === "error") {
                        setFeedback(data.error);
                    } else {
                        setEthButtonDisabled(false);
                    }
                });

            //node can-stake-rpl 199 ???

            if (nodeStatus.accountBalances.rpl  >= rplPriceData.minPerMinipoolRplStake) 
                if (nodeStatus.rplStake === 0) {
                    rpdDaemon(`node can-stake-rpl ${selectedRplStake}`, (data) => {
                        //{"status":"error","error":"Error getting transaction gas info: could not estimate gas limit: Could not estimate gas needed: execution reverted: Minipool count after deposit exceeds limit based on node RPL stake","canDeposit":false,"insufficientBalance":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"minipoolAddress":"0x0000000000000000000000000000000000000000","gasInfo":{"estGasLimit":0,"safeGasLimit":0}}
                        if (data.status === "error") {
                            setFeedback(data.error);

                        } else {
                            setRplStakeButtonDisabled(false);
                        }
                    });
                }
        }

        if (networkNodeFee && !selectedNodeFee) {
            setSelectedNodeFee(networkNodeFee * 0.97); // allow 3% slippage by default
        }

        if (nodeStatus) {
            setSelectedRplStake(nodeStatus.accountBalances.rpl); // TODO:  what if bigger than maximum? Allow user to change?
        }

        
    }, [nodeStatus, networkNodeFee]);

    const approveRpl = () => {
        rpdDaemon(`node stake-rpl-approve-rpl ${rplPriceData.maxPerMinipoolRplStake}`, (data) => { // set the maximum RPL stake as approval limit
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const stakeRpl = () => {
        rpdDaemon(`node stake-rpl ${selectedRplStake}`, (data) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const depositEth = () => {
        rpdDaemon(`node deposit ${ETHDepositAmmount} ${selectedNodeFee} 0`, (data) => {  //   rocketpool api node deposit amount min-fee salt
            if (data.status === "error") {
                setFeedback(data.error);
            }
            updateNodeStatus();
        });
    }

    const slider = (e) => {
        setSelectedNodeFee(e.target.value);
    }

    return (
        <div>
            {nodeStatus && (
                <>
                    <h3 className="title is-3 has-text-white">Create minipool</h3>
                    <p>TODO: extra info about procedure</p>
                    <div>
                        <h4 className="title is-4 has-text-white">Parameters</h4>
                        <p className="content">
                            <dl>
                                <dt>Node commision fee</dt>
                                <dd>As a node operator you earn half of the validator's total ETH rewards, plus an extra commission.
                                    The commission rate is based on how many minipools are in the queue and how much rETH is available in the staking pool, waiting to be staked. The lowest it can go is 5%, and the highest it can go is 20%. Once your minipool is created, its commission rate will be locked until you exit the validator and close the minipool. If you specify a commision that is higher than the current network's commision, ...<br />
                                    TODO: replace with fixed slippage setting and just inform user.<br />
                                    <b>Current Node commision fee: (Rocket Pool network)</b>{networkNodeFee} (Minimum: {minNodeFee}, maximum: {maxNodeFee})
                                </dd>
                                <dt>RPL</dt>
                                <dd>You can ... but it must be higher than {rplPriceData ? Math.ceil(displayAsETH(rplPriceData.minPerMinipoolRplStake)) : <Spinner />} RPL
                                </dd>
                            </dl>
                        </p>
                        <div className="field">
                            <input id="sliderWithValue" className="slider has-output" step="0.01" min={minNodeFee} max={maxNodeFee} defaultValue={networkNodeFee} type="range" onChange={slider} />
                            {displayAsPercentage(selectedNodeFee * 100)}

                        </div>

                        <p>Before your rocket pool contract can spend the RPL tokens, you need to approve first</p>
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