import React from "react";

const StakeRPL = ({ rpdDaemon }: { rpdDaemon: any }) => {

    const [command, setCommand] = React.useState<string>();
    const [runButtonEnabled, setRunButtonEnabled] = React.useState<boolean>(true);
    const [result, setResult] = React.useState<string>();

    const runCommand = () => {
        if (command) {
            setRunButtonEnabled(false)
            rpdDaemon(command, (data: any) => {
                setResult(JSON.stringify(data, null, 2))
                setRunButtonEnabled(true)
            }, (e: any) => {
                console.dir(e)
                setResult(e.response.data)
                setRunButtonEnabled(true)
            })
        }
    }

    const handleKeypress = (e: any) => {
        //it triggers by pressing the enter key
        if (["Enter", "NumpadEnter"].includes(e.keyCode)) {
            runCommand();
        }
    };

    return (
        <>
            <h2 className="title is-3 has-text-white">Run a manual RPD command</h2>
            <div className="rpdCommand">
                <div className="box has-background-dark">
                    <div className="field">
                        <label className="label">Rocketpoold command:</label>

                        <div className="field has-addons">
                            <div className="control">
                                <input className="input" type="text" onChange={(e) => { setCommand(e.target.value) }} placeholder="Type command (e.g. &quot;node status&quot;)" size={45} onKeyDown={handleKeypress} />
                            </div>
                            <div className="control">
                                <button className="button" disabled={!runButtonEnabled} onClick={runCommand}>
                                    Run
                                </button>
                            </div>
                        </div>

                        {result && (
                            <>
                                {/* <div className="container"> */}
                                <pre className="transcript">
                                    {result.replace(/\\n/g, "\n")}
                                </pre>
                                {/* </div> */}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}


export default StakeRPL