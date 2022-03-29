import autobahn from "autobahn-browser";
import React from "react";
const AutobahnContext = React.createContext();

const url = "ws://wamp.my.ava.do:8080/ws";
const realm = "dappnode_admin";

const Comp = ({ children }) => {

    let session;
    // const [session, setSession] = React.useState();
    const [packages, setPackages] = React.useState();


    const refreshPackages = () => {
        if (!session) return;
        session
            .call("listPackages.dappmanager.dnp.dappnode.eth")
            .then(res => {
                res = JSON.parse(res).result.reduce((accum, curr) => {
                    accum[curr.packageName] = curr;
                    return accum;
                }, {});
                setPackages(res);
            });
    }

    const value = React.useMemo(() => {
        return {
            session,
            packages,
            refreshPackages,
        }
    }, [session, packages]);


    React.useEffect(() => {
        const connection = new autobahn.Connection({
            url,
            realm
        });

        let interval;

        connection.onopen = s => {
            console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);

            session = s; //setSession(s);

            // pre-populate the packages
            refreshPackages();

            interval = setInterval(() => { refreshPackages(); }, 10 * 1000);

        };

        // connection closed, lost or unable to connect
        connection.onclose = (reason, details) => {
            console.error("CONNECTION_CLOSE", { reason, details });
            setSession(null);
        };

        connection.open();

        return ()=>{
            if (interval){
                clearInterval(interval);
            }
        }
    },[]);

    return <AutobahnContext.Provider value={value}>{children}</AutobahnContext.Provider>;

};

export default Comp;
export { AutobahnContext };

