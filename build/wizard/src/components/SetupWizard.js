import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, fas, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InitWallet from "./InitWallet";
import FundWallet from "./FundWallet";
import RegisterNode from "./RegisterNode";
import SetWithdrawalAddress from "./SetWithdrawalAddress";
import CreateMinipool from "./CreateMinipool";
import { beaconchainUrl, etherscanAddressUrl, displayAsETH } from './utils.js';


const SetupWizard = ({ walletStatus, updateWalletStatus, nodeStatus, rplPriceData, updateNodeStatus, rpdDaemon }) => {



    const initWallet = { id: Symbol("Init wallet").toString(), name: "Init wallet" };
    const fundNode = { id: Symbol("Fund Node").toString(), name: "Fund Node" };
    const registerNode = { id: Symbol("Register node").toString(), name: "Register node" };
    const withdrawalAddress = { id: Symbol("Withdrawal address").toString(), name: "Withdrawal address" };
    const createMinipool = { id: Symbol("Add minipool").toString(), name: "Add minipool" };

    const [viewState, setViewState] = React.useState(initWallet);

    const setupStates = [
        initWallet,
        fundNode,
        registerNode,
        withdrawalAddress,
        createMinipool
    ];

    React.useEffect(() => {
        if (nodeStatus && walletStatus) {
            if (nodeStatus.status === "error" && nodeStatus.error.includes("rocketpool wallet init")) {
                setViewState(initWallet);
                return;
            }
            if (nodeStatus.status === "success"
                && nodeStatus.accountAddress !== "0x0000000000000000000000000000000000000000"
                && !nodeStatus.registered
                && !nodeStatus.accountBalances.eth
                //TODO : && displayAsETH(nodeStatus.accountBalances.rpl) < ???
            ) {
                setViewState(fundNode);
                return;
            }
            if (nodeStatus.status === "success"
                && nodeStatus.accountAddress !== "0x0000000000000000000000000000000000000000"
                && !nodeStatus.registered
                && nodeStatus.accountBalances.eth > 0
            ) {
                setViewState(registerNode);
                return;
            }
            if (nodeStatus.status === "success"
                && nodeStatus.registered
                && nodeStatus.withdrawalAddress === nodeStatus.accountAddress) {
                setViewState(withdrawalAddress);
                return;
            }
            if (nodeStatus.status === "success"
                && nodeStatus.registered
                && nodeStatus.withdrawalAddress !== nodeStatus.accountAddress) {
                setViewState(createMinipool);
                return;
            }
        }
    }, [nodeStatus, walletStatus]);


    const isActive = (element) => {
        return element.id == viewState.id;

    }
    const isHollow = (element) => {
        return false;

    }

    const stateComment = (element) => {
        if ("comment" in element)
            return element.comment;
    }

    React.useEffect(() => {

    }, []);

    return (
        /* https://octoshrimpy.github.io/bulma-o-steps/ */
        <div>
            <br />
            <div className="columns">
                <div className="column">
                    <ul className="steps has-content-centered">
                        {setupStates.map((element) =>
                            <li className={"steps-segment" + (isActive(element) ? " is-active" : "")} key={element.name}>
                                <span className={"steps-marker" + (isHollow(element) ? " is-hollow" : "")}></span>
                                <div className="steps-content">
                                    <p className="is-size-4 has-text-white">{element.name}</p>
                                    <div className="extra-data has-text-white">{stateComment(element)}</div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <InitWallet walletStatus={walletStatus} updateWalletStatus={updateWalletStatus} rpdDaemon={rpdDaemon} />
            <FundWallet nodeStatus={nodeStatus} updateNodeStatus={updateNodeStatus} rpdDaemon={rpdDaemon} />
            <RegisterNode nodeStatus={nodeStatus} updateNodeStatus={updateNodeStatus} rpdDaemon={rpdDaemon} />
            <SetWithdrawalAddress nodeStatus={nodeStatus} updateNodeStatus={updateNodeStatus} rpdDaemon={rpdDaemon} />
            <CreateMinipool nodeStatus={nodeStatus} rplPriceData={rplPriceData} updateNodeStatus={updateNodeStatus} rpdDaemon={rpdDaemon} />
        </div>
    );
};

export default SetupWizard


