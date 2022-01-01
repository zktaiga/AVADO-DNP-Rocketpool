import React from "react";
import axios from "axios";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rocketpool from "../../../assets/rocketpool.png";
import autobahn from "autobahn-browser";
import MiniPoolStatus from "./MiniPoolStatus";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";

const Comp = () => {
    const [minipools, setMinipools] = React.useState();
    const [wampSession, setWampSession] = React.useState();
    
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

    React.useEffect(() => {
            async function fetchStatus() {
                await axios.post(`${config.api.HTTP}/rpd`, { command: "minipool status" }, { timeout: 5 * 60 * 1000 }).then((res) => {
                    const data = JSON.parse(res.data);
                    setMinipools(data.minipools)
                })
            }
            fetchStatus();
        
    }, []);

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
                            <br />
                            <MiniPoolStatus minipools={minipools} />
                        </div>
                    </div>
                </section>

                <BackupDashboard wampSession={wampSession} />

                <LogView wampSession={wampSession}/>
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