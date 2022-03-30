import autobahn from "autobahn-browser";
import React from "react";
const AutobahnContext = React.createContext();

const url = "ws://wamp.my.ava.do:8080/ws";
const realm = "dappnode_admin";

const Comp = ({ children }) => {

    // let session;
    const [session, setSession] = React.useState();
    const [packages, setPackages] = React.useState();


    const refreshPackages = (sesh) => {
        if (!sesh){
            console.log(`refreshPackages: cant find session`);
            return;
        }
        sesh
            .call("listPackages.dappmanager.dnp.dappnode.eth")
            .then(res => {
                res = JSON.parse(res).result.reduce((accum, curr) => {
                    accum[curr.packageName] = curr;
                    return accum;
                }, {});
                setPackages(res);
                console.log(`refreshed packages`);
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

            setSession(s);

            // pre-populate the packages
            refreshPackages(s);

            interval = setInterval(() => { refreshPackages(s); }, 10 * 1000);

        };

        // connection closed, lost or unable to connect
        connection.onclose = (reason, details) => {
            console.error("CONNECTION_CLOSE", { reason, details });
            setSession(null);
        };

        connection.open();

        return ()=>{
            if (interval){
                console.log(`clearing refreshpackages interval`)
                clearInterval(interval);
            }
        }
    },[]);

    return <AutobahnContext.Provider value={value}>{children}</AutobahnContext.Provider>;

};

export default Comp;
export { AutobahnContext };

