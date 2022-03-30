
import React from "react";
// import Spinner from "./Spinner";
import { StoreContext } from "./StoreContext";

const Comp = ({ name }) => {

    const { store } = React.useContext(StoreContext);

    if (!store) {
        return <>Loading...</>
    }
    const packageData = store.packages.find((pkg) => { return pkg.manifest.name === name });

    if (!packageData) {
        return <>Cannot find package {name}</>
    }

    return (
        <>
        <a href={`http://my.ava.do/#/installer/${packageData.manifesthash}`} target="_blank" className="button">Install {packageData.manifest.title}</a>
            {/* Install {name} {JSON.stringify(packageData)} */}
        </>
    )

};


export default Comp;
