import React from "react";
import axios from "axios";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rocketpool from "../../../assets/rocketpool.png";
import autobahn from "autobahn-browser";
import MiniPoolStatus from "./MiniPoolStatus";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";
import InitWallet from "./InitWallet";

// https://github.com/sponnet/avado-portal/blob/master/src/pages/Home.js#L4-L7
const states = {
    WELCOME: Symbol("Welcome"),
    CREATE_WALLET: Symbol("Create Wallet"),
    FUND_NODE: Symbol("Fund Node"),
    // CHECKINTERNET: 2,
    // CHECKUPDATES: 3,
    // PROVISIONING: 4,
    // ENABLEAUTOUPDATES: 5,
    FINISHED_STATUS: Symbol("Finished - Status")
};

const Comp = () => {
    const [walletStatus, setWalletStatus] = React.useState();
    const [minipoolStatus, setMinipoolStatus] = React.useState();
    const [nodeStatus, setNodeStatus] = React.useState();
    const [wampSession, setWampSession] = React.useState();
    const [viewState, setViewState] = React.useState(states.WELCOME);

    const stateName = (state) => Object.keys(states).find((k) => states[k] === state);

    React.useEffect(() => {
        console.log(`In state  ${stateName(viewState)}`);
    }, [viewState]);

    React.useEffect(() => {
        if (!nodeStatus) {
            setViewState(states.WELCOME);
            return;
        }
        if (nodeStatus.status === "error" && nodeStatus.error.includes("rocketpool wallet init")) {
            setViewState(states.CREATE_WALLET);
            return;
        }
        if (nodeStatus.status === "success"
            && nodeStatus.accountAddress !== "0x0000000000000000000000000000000000000000"
            && nodeStatus.registered === false
        ) {
            setViewState(states.FUND_NODE);
            return;
        }

        if (nodeStatus.status === "success") {
            setViewState(states.FINISHED_STATUS);
            return;
        }
    }, [nodeStatus, walletStatus, minipoolStatus]);


    React.useEffect(() => {
        const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
        const realm = "dappnode_admin";
        const connection = new autobahn.Connection({
            url,
            realm
        });
        connection.onopen = session => {
            console.debug("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
            setWampSession(session);
        };
        // connection closed, lost or unable to connect
        connection.onclose = (reason, details) => {
            this.setState({ connectedToDAppNode: false });
            console.error("CONNECTION_CLOSE", { reason, details });
        };
        connection.open();
    }, []);

    const rpdDaemon = async (command, callback) => {
        await axios.post(`${config.api.HTTP}/rpd`, { command: command }, { timeout: 5 * 60 * 1000 }).then((res) => {
            callback(res);
        })
    }
    const updateMiniPoolStatus = () => {
        rpdDaemon("minipool status", (res) => {
            const data = JSON.parse(res.data);
            setMinipoolStatus(data.minipools)
        });
    }

    const updateNodeStatus = () => {
        rpdDaemon("node status", (res) => {
            const data = JSON.parse(res.data);
            setNodeStatus(data)
        });
    }
    
    const updateWalletStatus = () => {
        rpdDaemon("wallet status", (res) => {
            const data = JSON.parse(res.data);
            setWalletStatus(data)
        });
    }

    React.useEffect(() => {
        updateMiniPoolStatus();
        updateNodeStatus();
        updateWalletStatus();
    }, []); // eslint-disable-line


    const header = () => {
        return (
            <div className="dashboard">
                <section className="keygen is-medium has-text-white">
                    <div className="columns is-mobile">
                        <div className="column is-8-desktop is-10">

                            <h1 className="title is-1 is-spaced has-text-white">Avado Rocket Pool</h1>
                            <p>Todo...</p>
                            <br />
                            <div className="columns">
                                <div className="column is-half ">
                                    <h1 className="title is-3 has-text-white">How does this work?</h1>
                                    <p>TODO.</p>
                                </div>
                                <div className="column is-half">
                                    <img src={rocketpool} alt="Rocket Pool logo" />
                                </div>
                            </div>
                            <InitWallet walletStatus={walletStatus} updateWalletStatus={updateWalletStatus} rpdDaemon={rpdDaemon} />
                            <br />
                            <MiniPoolStatus minipools={minipoolStatus} />
                        </div>
                    </div>
                </section>

                <BackupDashboard wampSession={wampSession} />

                <LogView wampSession={wampSession} />
            </div>

        )
    }

    return (
        <>
            {header()}
        </>
    )


};

export default Comp;