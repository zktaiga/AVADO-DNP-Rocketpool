import React from "react";
import axios from "axios";
import spinner from "../../../assets/spinner.svg";
import config from "../../../config";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import rhino from "../../../assets/rhino.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DownloadKeys from "./DownloadKeys.js";
import autobahn from "autobahn-browser";

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
    const [mnemonicLanguage, setMnemonicLanguage] = React.useState("english");
    const [cmdOutput, setCmdOutput] = React.useState();
    const [cmdShowOutput, setCmdShowOutput] = React.useState(false);
    const [wampSession, setWampSession] = React.useState();

    React.useEffect(() => {
        const connection = new autobahn.Connection({
            url,
            realm
        });
        connection.onopen = session => {
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
            setCmdOutput("<pre>"+res.data+"</pre>");
        })
        
        setGenerating(false);
    }

    const header = () => {
        return (
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
                                <img src={rhino} />
                                <p className="has-text-centered help">Leslie the Launchpad Rhino (<a target="_blank" href="https://launchpad.ethereum.org/">source</a>)</p>
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
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {header()}
        </>
    )


};

export default Comp;