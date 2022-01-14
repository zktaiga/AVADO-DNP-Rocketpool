import React from "react";

const Welcome = ({ }) => {
    return (
        <div>

            <div className="content">
                <h3 className="title is-3 has-text-white">How does this work?</h3>
                <p>TODO.</p>

                <h3 className="title is-3 has-text-white">Prerequisites</h3>
                <p>...</p>
                <dl>
                    <dt>Ethereum execution client (Geth)</dt>
                    <dd>Make sure the Ethereum exectution client package (Geth) is <b>installed</b> and <b>synced</b></dd>

                    <dt>Ethereum beacon chain client (Prysm)</dt>
                    <dd>Make sure the Ethereum beacon chain package (Prysm) is <b>installed</b> and <b>synced</b></dd>

                    <dt>Ether</dt>
                    <dd>Make sure you have enough Ether for <ul>
                        <li>your half of the validator deposit (16 ETH)</li>
                        <li>RPL</li>
                        <li>To pay for gas</li>
                    </ul>
                    </dd>


                </dl>
            </div>
        </div>

    );
};

export default Welcome


