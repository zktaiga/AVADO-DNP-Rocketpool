import React from "react";
import config from "../config";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";
import Spinner from "./Spinner";

const AdminPage = ({ wampSession }) => {
    const [isRestartValidator, setIsRestartValidator] = React.useState(false);
    const [isRestartRpNode, setIsRestartRpNode] = React.useState(false);

    const restartValidator = () => {
        setIsRestartValidator(true);
        fetch(`${config.api.HTTP}/restart-validator`)
            .then(res => res.text())
            .then(data => {
                setIsRestartValidator(false);
                alert(data);
            }
            );
    }

    const restartRpNode = () => {
        setIsRestartRpNode(true);
        fetch(`${config.api.HTTP}/restart-rocketpool-node`)
            .then(res => res.text())
            .then(data => {
                setIsRestartRpNode(false);
                alert(data);
            }
            );
    }

    return (
        <div>
            <h2>Debug</h2>
            <div className="field">
                <button className="button" onClick={restartValidator} disabled={isRestartValidator}>Restart validator{isRestartValidator ? <Spinner /> : ""}</button>
            </div>
            <div className="field">
                <button className="button" onClick={restartRpNode} disabled={isRestartRpNode}>Restart Rocket Pool Node{isRestartRpNode ? <Spinner /> : ""}</button>
            </div>
            <br />
            <BackupDashboard wampSession={wampSession} />
            <br />
            <LogView wampSession={wampSession} />
            <br />
            <a href="http://my.ava.do/#/Packages/rocketpool.avado.dnp.dappnode.eth/detail">Avado Rocket Pool package details</a>
        </div>
    );
};

export default AdminPage