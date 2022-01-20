const configs = {
    development: {
        name: "dev",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
            // HTTP: "http://localhost:9999",
        },
        wsProvider: "ws://goerli-geth.my.ava.do:8546"
    },

    production: {
        name: "prod",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
        },
        wsProvider: "ws://goerli-geth.my.ava.do:8546"
    }
};
let config = process.env.REACT_APP_STAGE
    ? configs[process.env.REACT_APP_STAGE]
    : configs.development;

export default config;
