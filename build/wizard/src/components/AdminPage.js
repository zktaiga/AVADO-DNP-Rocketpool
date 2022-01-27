import React from "react";
import config from "../config";
import BackupDashboard from "./BackupDashboard";
import LogView from "./LogView";
import Spinner from "./Spinner";
const packageName = "rocketpool.avado.dnp.dappnode.eth";

const AdminPage = ({ wampSession }) => {
    const [isRestartValidator, setIsRestartValidator] = React.useState(false);
    const [isRestartRpNode, setIsRestartRpNode] = React.useState(false);
    const [network, setNetwork] = React.useState("");

    React.useEffect(() => {
        getNetwork();
    }, [wampSession]) // eslint-disable-line

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

    const testEnv = async () => {
        const newNetwork = (network === "prater") ? "mainnet" : "prater";

        // updatePackageEnv: {
        await wampSession.call("updatePackageEnv.dappmanager.dnp.dappnode.eth", [], {
                id: packageName,
                envs: { NETWORK: newNetwork },
                restart: true
            });
        
    }

    const getNetwork = async () => {
        const packagesRaw = await wampSession.call("listPackages.dappmanager.dnp.dappnode.eth", [],);
        const packages = JSON.parse(packagesRaw);
        if (packages.success) {
            setNetwork(packages.result.find(r => r.name === packageName).envs.NETWORK)
        }
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
            {network && (
                <p><b>Network: </b>{network}</p>
            )}
            <div className="field">
                <button className="button" onClick={testEnv}>Experiment</button>
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