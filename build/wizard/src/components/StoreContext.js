import axios from "axios";
import React from "react";
const StoreContext = React.createContext();

const Comp = ({ children }) => {

    const [store, setStore] = React.useState();

    const value = React.useMemo(() => {
        return {
            store
        }
    }, [store]);


    React.useEffect(() => {

        const fetchData = async () => {
            const storeHash = JSON.parse((await axios.get("https://bo.ava.do/value/store")).data).hash;
            const store = (await axios.get(`http://ipfs.my.ava.do:8080/ipfs/${storeHash}`)).data;

            setStore(store);
        }
        fetchData();

    }, []);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;

};

export default Comp;
export { StoreContext };

