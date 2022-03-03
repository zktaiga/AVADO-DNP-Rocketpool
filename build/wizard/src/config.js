const configs = {
    development: {
        name: "dev",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
            // HTTP: "http://localhost:9999",
        },
        explorer:{
            URL: "http://goerli.etherscan.io"
        }
    },

    production: {
        name: "prod",
        admin: true,
        api: {
            HTTP: "http://rocketpool.my.ava.do:9999",
        },
        explorer:{
            URL: "http://etherscan.io"
        }
    }
};
let config = process.env.REACT_APP_STAGE
    ? configs[process.env.REACT_APP_STAGE]
    : configs.development;

export default config;
