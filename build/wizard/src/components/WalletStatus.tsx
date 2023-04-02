import React from "react";
import { nodeStatusType } from "./Types"

interface Props {
    utils: any,
    nodeStatus?: nodeStatusType,
    updateNodeStatus: any
}

const WalletStatus: React.FC<Props> = ({ utils, nodeStatus, updateNodeStatus }: Props) => {
    return (
        <div>
            <h2 className="title is-3 has-text-white">Wallet</h2>
            {nodeStatus && nodeStatus.accountAddress && nodeStatus.accountBalances.eth !== null && nodeStatus.accountBalances.rpl !== null && (
                <div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><b>ETH</b></td>
                                <td>{utils.displayAsETH(nodeStatus.accountBalances.eth)}</td>
                            </tr>
                            <tr>
                                <td><b>RPL</b></td>
                                <td>{utils.displayAsETH(nodeStatus.accountBalances.rpl)}</td>
                            </tr>
                            <tr><td><b>Account Address</b></td><td>{utils.etherscanAddressUrl(nodeStatus.accountAddress)}</td></tr>
                        </tbody>
                    </table>
                    <button className="button" onClick={updateNodeStatus}>Refresh</button>
                </div>
            )}
        </div>
    );
};

export default WalletStatus