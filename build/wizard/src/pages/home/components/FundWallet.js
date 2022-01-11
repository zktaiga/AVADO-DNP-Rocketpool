import React from "react";
import web3 from "web3";

const FundWallet = ({ nodeStatus, updateNodeStatus }) => {
    console.log(nodeStatus);

    // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
    return (
        <div>
            <h2 className="title is-3 has-text-white">Fund wallet</h2>
            {nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.rpl !== null && (
                <>
                    <p>Before you can... fund your wallet ({nodeStatus.accountAddress})</p>
                    <p>Node Funding:</p>
                    <ul>
                        <li><b>ETH: </b>{web3.utils.fromWei(String(nodeStatus.accountBalances.eth), 'ether')} </li>
                        <li><b>RPL: </b>{web3.utils.fromWei(String(nodeStatus.accountBalances.rpl), 'ether')} </li>
                    </ul>
                </>
            )}
            <button onClick={updateNodeStatus}>Refresh</button>
        </div>
    );
};

export default FundWallet