import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import config from "../../../config";


import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import autobahn from "autobahn-browser";

const packageName = "rocketpool.avado.dnp.dappnode.eth";

const Comp = ({ session }) => {

    const [dataresult, setDataresult] = React.useState();
    const [restartresult, setRestartresult] = React.useState();

    const restart = async () => {
        const res = JSON.parse(await session.call("restartPackage.dappmanager.dnp.dappnode.eth", [],
            {
                id: packageName,
            }));
        if (res.success === true) {
            setRestartresult("restarting package - wait a few minutes and reload this page");
        }
    }

   async function uploadFile(file, path, name, setMsg) {
        const data = new FormData();
        data.append('file', file);
        axios.post(`${config.api.HTTP}/upload-test`, data).then(res => {
            setMsg(res.data.message);
        }).catch(err => {
          console.log(err);
        });
    }

    return (
        <>
            <div>
                data.upload &nbsp;
            <input
                    type="file"
                    onChange={e => uploadFile(e.target.files[0], "/", "data", setDataresult)}
                />
                {dataresult && (<div className="is-size-7">{dataresult}</div>)}
            </div>
            
            {dataresult && (
                <>
                    <button className="button" onClick={restart}>restart node</button>
                    {restartresult && (<div className="is-size-7">{restartresult}</div>)}
                </>
            )}
        </>
    );

}


export default Comp;