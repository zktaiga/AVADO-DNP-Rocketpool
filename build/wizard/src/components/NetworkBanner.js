import React from "react";

const NetworkBanner = () => {
    return (
        <>
            {process.env.NETWORK === "prater" && (
                <section class="hero is-warning">
                    <div className="hero-body is-small">
                        <p className="has-text-centered">Using the Prater Test Network</p>
                    </div>
                </section>
            )}
            {process.env.NETWORK !== "prater" && process.env.NETWORK !== "mainnet" && (
                <section class="hero is-danger">
                    <div className="hero-body is-small">
                        <p className="has-text-centered">Wrongly configured NETWORK environment variable: Using the Prater Test Network</p>
                    </div>
                </section>
            )}
        </>
    );
};

export default NetworkBanner


