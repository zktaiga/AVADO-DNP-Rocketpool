const wsProvider=({
    "prater": 'ws://goerli-geth.my.ava.do:8546',
    "mainnet": 'ws://geth.my.ava.do:8546',
  })[process.env.NETWORK] || 'ws://goerli-geth.my.ava.do:8546' // use prater as default (TODO change to mainnet for release)

const configs = {
    development: {
        name: "dev",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
            // HTTP: "http://localhost:9999",
        },
        wsProvider: wsProvider
    },

    production: {
        name: "prod",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
        },
        wsProvider: wsProvider
    }
};
let config = process.env.REACT_APP_STAGE
    ? configs[process.env.REACT_APP_STAGE]
    : configs.development;

export default config;
