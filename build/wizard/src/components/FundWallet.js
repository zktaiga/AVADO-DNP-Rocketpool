import React from "react";
import { etherscanAddressUrl, displayAsETH } from './utils.js';

import web3 from "web3";
const BN = web3.utils.BN;

const FundWallet = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {

    const [rplPriceData, setRplPriceData] = React.useState();

    React.useEffect(() => {
        rpdDaemon("network rpl-price", (data) => setRplPriceData(data));
    }, []); // eslint-disable-line


    return (nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.eth <= 0 &&
        <div>
            <h2 className="title is-3 has-text-white">Fund wallet</h2>
            { nodeStatus.accountBalances.rpl !== null && rplPriceData && (
                <>
                    <p>Before you can... fund your wallet ({etherscanAddressUrl(nodeStatus.accountAddress)})</p>
                    <p>Requirements:</p>
                    <ul>
                        <li>ETH: minimum 16 ETH (+ gas money)</li>
                        <li>RPL: minimum {Math.ceil(displayAsETH(rplPriceData.minPerMinipoolRplStake))} RPL,
                                 maximium {Math.floor(displayAsETH(rplPriceData.maxPerMinipoolRplStake))}
                        </li>

                    </ul>
                    <p>Node Funding:</p>
                    <ul>
                        <li><b>ETH: </b>{displayAsETH(nodeStatus.accountBalances.eth)} </li>
                        <li><b>RPL: </b>{displayAsETH(nodeStatus.accountBalances.rpl)} </li>
                    </ul>
                </>
            )}
            <button className="button" onClick={updateNodeStatus}>Refresh</button>
        </div>
    );
};

export default FundWallet