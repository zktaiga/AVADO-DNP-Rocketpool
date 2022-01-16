import React from "react";
import SyncStatusTag from "./SyncStatusTag";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, fas, faSpinner } from "@fortawesome/free-solid-svg-icons";
import config from "../../../config";

const Header = ({ rocketpoollogo, nodeSyncStatus }) => {

    const [gasPrice, setGasPrice] = React.useState();
    const eth = new web3(config.wsProvider).eth;
    
    React.useEffect(() => {
        const interval = setInterval(() => {            
            eth.getGasPrice().then((result) => {
                const currentPrice =  parseFloat(web3.utils.fromWei(result, 'gwei')).toFixed(3);
                console.log("Gas: " + currentPrice);
                setGasPrice(currentPrice);
            })
          }, 15*1000);
          return () => clearInterval(interval);
    }, [eth]);

    return (
        <div className="hero-body is-small is-primary py-0">
            <div className="columns">
                <div className="column is-narrow">
                    <figure className="image is-64x64">
                        <img src={rocketpoollogo} alt="Rocket Pool logo" />
                    </figure>
                </div>
                <div className="column">
                    <span>
                        <h1 className="title is-1 has-text-white">Avado Rocket Pool</h1>
                    </span>
                    <p>Rocket Pool without the command line</p>
                </div>
            </div>

            {nodeSyncStatus && (
                <p className="has-text-right">
                    Geth: <SyncStatusTag progress={nodeSyncStatus.eth1Progress} />,
                    Prysm: <SyncStatusTag progress={nodeSyncStatus.eth2Progress} />,
                    <FontAwesomeIcon className="icon" icon={faGasPump} /> {gasPrice?gasPrice:<FontAwesomeIcon className="icon fa-spin" icon={faSpinner} />} gwei
                </p>
            )}
        </div>
    );
};

export default Header


