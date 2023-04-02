import React from 'react';
import web3 from "web3";

class Utils {
    network: "prater" | "mainnet";
    beaconChainBaseUrl : string;
    etherscanBaseUrl: string;

    constructor(network: "prater" | "mainnet") {
        this.network = network;
        this.beaconChainBaseUrl = ({
            "prater": "https://prater.beaconcha.in",
            "mainnet": "https://beaconcha.in",
        })[this.network];
    
        this.etherscanBaseUrl = ({
            "prater": "https://goerli.etherscan.io",
            "mainnet": "https://etherscan.io",
        })[this.network];
    }

    beaconchainUrl(validatorPubkey:string, text:string) {
        return <a target="_blank" rel="noopener noreferrer" href={this.beaconChainBaseUrl + "/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
    }

    etherscanAddressUrl(address: string, text:string) {
        return <a target="_blank"rel="noopener noreferrer" href={this.etherscanBaseUrl + "/address/" + address}>{text ? text : address}</a>;
    }

    etherscanTransactionUrl(txHash: string, text: string) {
        return <a target="_blank" rel="noopener noreferrer" href={this.etherscanBaseUrl + "/tx/" + txHash}>{text ? text : txHash}</a>;
    }

    rocketscanUrl(path:string, child: React.ReactNode) {
        const praterPrefix = (this.network === "prater") ? "prater." : ""
        return <a target="_blank" rel="noopener noreferrer" href={"https://" + praterPrefix + "rocketscan.io" + path} >{child}</a>
    }

    displayAsETH(number:number, fractionDigits:number) {
        if (!number)
            return 0;
        // https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#fromwei
        const result = web3.utils.fromWei(String(number), 'ether');
        if (fractionDigits)
            return parseFloat(result).toFixed(fractionDigits)
        return result
    }

    displayAsPercentage(number:string) {
        if (!number)
            return "- %";
        return parseFloat(number).toFixed(2) + "%";
    }

    wsProvider() {
        return ({
            "prater": 'ws://goerli-geth.my.ava.do:8546',
            "mainnet": 'ws://ethchain-geth.my.ava.do:8546',
        })[this.network] || 'ws://ethchain-geth.my.ava.do:8546'
    }
}

export default Utils