import React from "react";

const Welcome = () => {
    return (
        <div>

            <div className="content">
                <div className="section-subtitle ">Welcome to Avado Rocket Pool</div>
                
                <p>Check the <a href="https://wiki.ava.do/en/rocketpool">Avado Rocket Pool Wiki page</a> before you proceed.</p>

                <h3 className="title is-3 has-text-white">Prerequisites</h3>
                <p>...</p>
                <dl>
                    <dt>Ethereum execution client (Geth)</dt>
                    <dd>Make sure the Ethereum exectution client package (Geth) is <b>installed</b> and <b>synced</b></dd>

                    <dt>Ethereum beacon chain client (Prysm)</dt>
                    <dd>Make sure the Ethereum beacon chain package (Prysm) is <b>installed</b> and <b>synced</b></dd>

                    <dt>Ether</dt>
                    <dd>Make sure you have enough Ether<ul>
                        <li>16 ETH for your half of the validator deposit</li>
                        <li>~1.6 ETH worth of RPL</li>
                        <li>~0.? ETH to pay for gas</li>
                    </ul>                    
                    </dd>
                </dl>
            </div>
        </div>

    );
};

export default Welcome


