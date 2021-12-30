import React from "react";
import PropTypes from "prop-types";

function url(publicKey) {
    return "https://prater.beaconcha.in/validator/" + publicKey + "#rocketpool";
}

const BeaconchainLink = ({ publicKey }) => {
    if (!publicKey)
        return (
            <>
            </>
        );
    return (
        <>
            <p><a href={url(publicKey)}>More validator info on the Ethereum 2.0 Beacon Chain Explorer</a></p>
        </>
    );
};

BeaconchainLink.defaultProps = {
    title : ""
}

BeaconchainLink.prototypes = {
    title: PropTypes.string
}

export default BeaconchainLink