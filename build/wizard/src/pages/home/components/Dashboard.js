import React from "react";
import axios from "axios";
import spinner from "../../../assets/spinner.svg";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rocketpool from "../../../assets/rocketpool.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import autobahn from "autobahn-browser";
import BeaconchainLink from "./BeaconchainLink";
import DownloadBackup from "./DownloadBackup";
import RestoreBackup from "./RestoreBackup";

const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";
const packageName = "rocketpool.avado.dnp.dappnode.eth";

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

    // interface validatorStatus {
    //     pubkey : String;
    //     status : String;
    //     active : Boolean;
    //     index : BigInteger;
    // }

    const [validator, setValidator] = React.useState();
    const [tab, setTab] = React.useState("backup");
    const [wampSession, setWampSession] = React.useState();
    const [log, setLog] = React.useState("Loading...");

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
        async function test() {
            if (wampSession) {
                const x = await wampSession.call("logPackage.dappmanager.dnp.dappnode.eth", [],
                    {
                        id: packageName,
                        options: { tail: 20 }
                    }
                );
                const res = JSON.parse(x);
                setLog(res.result);
            }
        }
        test();
    }, [wampSession])

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

                    const validator = {
                        pubkey: minipoool0.validatorPubkey,
                        status: minipoool0.status.status,
                        index: minipoool0.validator.index,
                        active: minipoool0.validator.active
                    }
                    setValidator(validator);
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

                                    <p>
                                        TODO.</p>

                                </div>
                                <div className="column is-half">
                                    <img src={rocketpool} />
                                </div>
                            </div>
                            {
                                <>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button disabled={!readyToGenerate || generating} onClick={() => { generate(password, amount) }} className="button is-link is-light">Query rocket pool node status</button>
                                        </div>
                                    </div>
                                </>}
                            {generating && (
                                <>
                                    <p>{progress}</p>
                                    <img alt="spinner" src={spinner} />
                                </>
                            )}

                            {
                                (
                                    <>
                                        {
                                            <>
                                                <br /><br />
                                                <pre className="transcript">
                                                    {cmdOutput}
                                                </pre>
                                            </>
                                        }
                                    </>
                                )
                            }
                            <br />
                            <BeaconchainLink validator={validator} />

                        </div>
                    </div>
                </section>
                <div className="setting">
                    <section className="is-medium has-text-white">
                        <div className="columns">
                            <div className="column is-half">

                                <nav className="panel is-half">
                                    <p className="panel-heading">Backup and Restore</p>

                                    <p className="panel-tabs">
                                        <a className={`${tab === "backup" ? "is-active  has-text-weight-bold" : ""} has-text-white`} onClick={() => { setTab("backup") }} >Backup</a>
                                        <a className={`${tab === "restore" ? "is-active has-text-weight-bold" : ""} has-text-white`} onClick={() => { setTab("restore") }} >Restore</a>
                                    </p>
                                    <div className="panel-block">

                                        {tab === "backup" && (
                                            <section className="is-medium has-text-white">
                                                <p className="">TODO: add info about downloading backup (security advisory too (contains password)).</p>
                                                <DownloadBackup />
                                            </section>
                                        )}
                                        {tab === "restore" && (
                                            <section className="is-medium has-text-white">
                                                <p className="">Here you can upload your node identity keys. If you want to restore your node ID from a previous installation.</p>
                                                <RestoreBackup session={wampSession} />
                                            </section>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </section>
                </div>
                <div>
                    <h2 className="title is-3 has-text-white">Latest log entries</h2>
                    <pre className="transcript">
                        {log}
                    </pre>
                </div>
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