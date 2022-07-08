import React from "react";
import BN from "bn.js"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Spinner from "./Spinner";
import config from "../config";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const StakeRPL = ({ rpdDaemon }) => {

    const [command, setCommand] = React.useState();
    const [runButtonEnabled, setRunButtonEnabled] = React.useState(true);
    const [result, setResult] = React.useState();

    const runCommand = () => {
        if (command) {
            setRunButtonEnabled(false)
            rpdDaemon(command, (data) => {
                setResult(JSON.stringify(data, null, 2))
                setRunButtonEnabled(true)
            }, (e) => {
                setResult(JSON.stringify(e, null, 2))
                setRunButtonEnabled(true)
            })
        }
    }

    return (
        <>
            <h2 className="title is-3 has-text-white">Run a manual RPD command</h2>
            <div className="rpdCommand">
                <div className="box has-background-dark">
                    <div className="field">
                        <label className="label">Rocketpoold command:</label>

                        <div className="field has-addons">
                            <div className="control">
                                <input className="input" type="text" onChange={(e) => { setCommand(e.target.value) }} placeholder="Type command (e.g. &quot;node status&quot;)" size="45" />
                            </div>
                            <div className="control">
                                <a className="button" disabled={!runButtonEnabled} onClick={runCommand}>
                                    Run
                                </a>
                            </div>
                        </div>

                        {result && (
                            <>
                                {/* <div className="container"> */}
                                    <pre className="transcript">
                                        {result.replace(/\\n/g, "\n")}
                                    </pre>
                                {/* </div> */}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}


export default StakeRPL