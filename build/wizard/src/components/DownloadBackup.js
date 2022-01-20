import React from "react";
import config from "../config";

const DownloadBackup = () => {

    const downloadBackup = () => {
        window.location.href = `${config.api.HTTP}/rocket-pool-backup.zip`;
    }


    return (
        <button className="button" onClick={downloadBackup}>Download Rocket Pool Data Backup</button>
    );

}


export default DownloadBackup;