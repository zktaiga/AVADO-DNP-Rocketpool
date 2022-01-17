import React from "react";
import { beaconchainUrl, etherscanAddressUrl, displayAsETH } from './utils.js';

import web3 from "web3";
const BN = web3.utils.BN;

const FundWallet = ({ nodeStatus, updateNodeStatus, rpdDaemon }) => {

    //const getRplMinium = () => nodeStatus ? displayAsETH(n
    // rpd network rpl-price
    // {"status":"success","error":"","rplPrice":11613106459524954,"rplPriceBlock":6199200,"minPerMinipoolRplStake":137775366614993524895,"maxPerMinipoolRplStake":2066630499224902873416}
    //web3.utils.fromWei(


    const [rplPriceData, setRplPriceData] = React.useState();

    React.useEffect(() => {
        rpdDaemon("network rpl-price", (data) => setRplPriceData(data));
    }, []); // eslint-disable-line


    // React.useEffect(() => {
    //     if (rplPriceData) {
    //         console.log(rplPriceData);
    //         console.log(typeof rplPriceData.maxPerMinipoolRplStake);
    //         console.log(rplPriceData.maxPerMinipoolRplStake);
    //         console.log(rplPriceData.maxPerMinipoolRplStake.toString());
    //         const max = new BN(rplPriceData.maxPerMinipoolRplStake.toString());
    //         console.log(max.toString());
    //     }
    // }, [rplPriceData]);


    //, maximium {displayAsETH(rplPriceData.maxPerMinipoolRplStake)}

    // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
    return (
        <div>
            <h2 className="title is-3 has-text-white">Fund wallet</h2>
            {nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.rpl !== null && rplPriceData && (
                <>
                    <p>Before you can... fund your wallet ({etherscanAddressUrl(nodeStatus.accountAddress)})</p>
                    <p>Requirements:</p>
                    <ul>
                        <li>ETH: minimum 16 ETH (+ gas money)</li>
                        <li>RPL: minimum {Math.ceil(displayAsETH(rplPriceData.minPerMinipoolRplStake))} RPL

                            {/* , maximium {Math.floor(displayAsETH(new BN(rplPriceData.maxPerMinipoolRplStake)))} */}
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