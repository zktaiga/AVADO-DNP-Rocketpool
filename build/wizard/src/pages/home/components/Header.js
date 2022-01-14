import React from "react";
import SyncStatusTag from "./SyncStatusTag";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import config from "../../../config";

const Header = ({ rocketpoollogo, nodeSyncStatus }) => {

    const [gasPrice, setGasPrice] = React.useState();
    const w3 = new web3(config.wsProvider);
    
    React.useEffect(() => {
        w3.eth.getGasPrice().then((result) => {
            const currentPrice = 
            parseFloat(web3.utils.fromWei(result, 'gwei')).toFixed(3)
            console.log("Gas: " + currentPrice);
            setGasPrice(currentPrice);
        })
    }, [5000]);

    return (
        <div className="hero-body is-small is-primary">
            <div className="columns">
                <div className="column is-narrow">
                    <figure className="image is-64x64">
                        <img src={rocketpoollogo} alt="Rocket Pool logo" />
                    </figure>
                </div>
                <div className="column">
                    <div className="container">
                        <h1 className="title is-1 is-spaced has-text-white">Avado Rocket Pool</h1>
                    </div>
                    <p>Rocket Pool without the command line</p>
                </div>
                <div className="column">
                    <nav className="panel">
                        <p className="panel-heading">
                            Status
                        </p>
                        <p className="panel-block">
                            ETH1
                        </p>
                        <p className="panel-block">
                            ETH2
                        </p>
                    </nav>
                </div>
            </div>

            {nodeSyncStatus && (
                <p>
                    Geth: <SyncStatusTag progress={nodeSyncStatus.eth1Progress} />, Prysm: <SyncStatusTag progress={nodeSyncStatus.eth2Progress} />, <FontAwesomeIcon className="icon" icon={faGasPump} /> {gasPrice} gwei
                </p>
            )}
        </div>
    );
};

export default Header


