import React from "react";
import BN from "bn.js"
// import web3 from "web3";
// const BN = web3.utils.BN;
import ClickToCopy from "./ClickToCopy";

const FundWallet = ({ utils, nodeStatus, updateNodeStatus, rplPriceData }) => {

    // const [rplPriceData, setRplPriceData] = React.useState();

    // React.useEffect(() => {
    //     rpdDaemon("network rpl-price", (data) => setRplPriceData(data));
    // }, []); // eslint-disable-line

    console.log("RPL", (new BN(rplPriceData.minPerMinipoolRplStake.toString())).toString());
    console.log("BALANCE RPL", (new BN(nodeStatus.accountBalances.rpl.toString())).toString())
    return (
        <div>
            {/* {nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.eth <= 0 && ( */}
            <>
                <h2 className="title is-3 has-text-white">Fund wallet</h2>
                {rplPriceData && (
                    <div className="content">
                        <p>Now you need to fund your Rocketpool hot wallet.</p>
                        <ol>
                            <li>Send 16.4 ETH to <ClickToCopy text={nodeStatus.accountAddress}>{utils.etherscanAddressUrl(nodeStatus.accountAddress)}</ClickToCopy> (16 ETH + 0.2 ETH gas money)</li>
                            <br />(0.4 is a safe margin to create everything - including the expensive minipool contract deploy. The remaining gas can be withdrawn from this wallet later)
                            <li>Send a minimum of {Math.ceil(utils.displayAsETH(rplPriceData.minPerMinipoolRplStake))} RPL to <ClickToCopy text={nodeStatus.accountAddress}>{utils.etherscanAddressUrl(nodeStatus.accountAddress)}</ClickToCopy>
                                <br />(maximum allowed stake is {Math.floor(utils.displayAsETH(rplPriceData.maxPerMinipoolRplStake))} RPL - the more you stake, the more you will earn. More details on the <a target="_blank" href="https://wiki.ava.do/en/tutorials/rocketpool">Avado Rocket Pool Wiki page</a> )
                                <br />(All RPL sent to this wallet will be used as your stake later - so please send exactly the desired stake amount)
                            </li>

                        </ol>
                        <p>Current Wallet balances:</p>
                        <ul>
                            <li><b>ETH: </b>{(new BN(nodeStatus.accountBalances.eth.toString()).lt(new BN("16000000000000000000"))) ?
                                (<span className="tag is-danger ">{utils.displayAsETH(nodeStatus.accountBalances.eth)} ETH</span>)
                                :
                                (<span className="tag is-success ">{utils.displayAsETH(nodeStatus.accountBalances.eth)} ETH</span>)
                            }
                            </li>

                            <li><b>RPL: </b>{(new BN(nodeStatus.accountBalances.rpl.toString())).lt(new BN(rplPriceData.minPerMinipoolRplStake.toString())) ?
                                (<span className="tag is-danger ">{utils.displayAsETH(nodeStatus.accountBalances.rpl)} RPL</span>)
                                :
                                (<span className="tag is-success ">{utils.displayAsETH(nodeStatus.accountBalances.rpl)} RPL</span>)
                            }
                            </li>
                        </ul>

                    </div>
                )}
                <button className="button" onClick={updateNodeStatus}>Refresh balances</button>
                <br />
                <br />
                <p>You will go to the next step once you have funded your wallet sufficiently.</p>
            </>
            {/* )} */}
        </div>
    );
};

export default FundWallet