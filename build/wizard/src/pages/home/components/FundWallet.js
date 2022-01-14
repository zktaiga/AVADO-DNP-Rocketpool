import React from "react";
import { beaconchainUrl, etherscanAddressUrl, displayAsETH } from './utils.js';


const FundWallet = ({ nodeStatus, updateNodeStatus }) => {
    // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
    return (
        <div>
            <h2 className="title is-3 has-text-white">Fund wallet</h2>
            {nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.rpl !== null && (
                <>
                    <p>Before you can... fund your wallet ({etherscanAddressUrl(nodeStatus.accountAddress)})</p>
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