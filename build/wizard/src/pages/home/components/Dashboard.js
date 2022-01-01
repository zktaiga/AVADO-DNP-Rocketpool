import React from "react";
import axios from "axios";
import spinner from "../../../assets/spinner.svg";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rocketpool from "../../../assets/rocketpool.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import autobahn from "autobahn-browser";
import MiniPoolStatus from "./MiniPoolStatus";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";

const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

const Comp = () => {

    const [password, setPassword] = React.useState();
    const [verifyPassword, setVerifyPassword] = React.useState();
    const [amount, setAmount] = React.useState(1);
    const [progress, setProgress] = React.useState();
    const [generating, setGenerating] = React.useState(false);
    const [readyToGenerate, setReadyToGenerate] = React.useState(false);
    const [passwordFieldType, setPasswordFieldType] = React.useState("password");
    const [passwordFieldIcon, setPasswordFieldIcon] = React.useState(faEyeSlash);
    const [cmdOutput, setCmdOutput] = React.useState();



    const [validator, setValidator] = React.useState();
    const [minipools, setMinipools] = React.useState();
    const [wampSession, setWampSession] = React.useState();

    React.useEffect(() => {
        const connection = new autobahn.Connection({
            url,
            realm
        });
        connection.onopen = session => {
            console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
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
        if (password && password.length > 7 &&
            !isNaN(parseInt(amount)) &&
            parseInt(amount) > 0 &&
            password === verifyPassword &&
            !generating
        ) {
            setReadyToGenerate(true);
        } else {
            setReadyToGenerate(true);
        }
    }, [password, amount, verifyPassword, generating]);

    React.useEffect(() => {
        if (!validator) {
            async function fetchStatus() {
                await axios.post(`${config.api.HTTP}/rpd`, { command: "minipool status" }, { timeout: 5 * 60 * 1000 }).then((res) => {
                    const data = JSON.parse(res.data);
                    const minipoool0 = data.minipools[0];
                    setMinipools(data.minipools)
                })
            }
            fetchStatus();
        }
    }, []);

    const toggleViewPassword = () => {
        const currentType = passwordFieldType;
        setPasswordFieldType(currentType === "password" ? "text" : "password");
        setPasswordFieldIcon(currentType === "password" ? faEye : faEyeSlash);
    }

    const generate = async (password, amount) => {
        if (generating) return;
        setGenerating(false);
        setProgress(`Running key generator.. Hang on to your socks! This might take a minute.`);
        await axios.post(`${config.api.HTTP}/rpd`, { command: "minipool status" }, { timeout: 5 * 60 * 1000 }).then((res) => {
            const data = JSON.parse(res.data);
            setCmdOutput(JSON.stringify(data));
        })

        setGenerating(false);
    }

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
                                    <img src={rocketpool} />
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