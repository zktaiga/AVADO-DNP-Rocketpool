import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const InitWallet = ({ walletStatus, rpdDaemon }) => {
    const [password, setPassword] = React.useState("");
    const [passwordFeedback, setPasswordFeedback] = React.useState("foobar");
    const [verifyPassword, setVerifyPassword] = React.useState();
    const [passwordFieldType, setPasswordFieldType] = React.useState("password");
    const [passwordFieldIcon, setPasswordFieldIcon] = React.useState(faEyeSlash);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const toggleViewPassword = () => {
        const currentType = passwordFieldType;
        setPasswordFieldType(currentType === "password" ? "text" : "password");
        setPasswordFieldIcon(currentType === "password" ? faEye : faEyeSlash);
    }

    React.useEffect(() => {
        //{"status":"error","error":"Invalid wallet password 'test' - must be at least 12 characters long"}
        if (password.length < 12) {
            setPasswordFeedback("Invalid wallet password - must be at least 12 characters long");
            setButtonDisabled(true);
        } else if (password !== verifyPassword) {
            setPasswordFeedback("Invalid wallet password - passwords do not match");
            setButtonDisabled(true);
        } else {
            setPasswordFeedback();
            setButtonDisabled(false);
        }
    }, [password, verifyPassword]);


    // Flow:
    // User picks password (twice)
    // -> check => enable init button
    // -> force user to back up mnemonic -> download or write down? (Ask Stefaan)

    // Future improvement: allow recovery (`wallet recover mnemonic`)

    const initWallet = () => {
        //rpd wallet set-password
        // testtesttest
        
        rpdDaemon("wallet set-password \""+ password + "\"", (res) => {
            const data = JSON.parse(res.data);
            console.log(res);
            if (data.status == "error") {
                setPasswordFeedback(data.error);
            }
            // Set ready for init
        });

        // if (???)
        rpdDaemon("wallet init", (res) => {
            const data = JSON.parse(res.data);
            console.log(res);
            if (data.status == "error") {
                setPasswordFeedback(data.error);
            }

            //{"status":"success","error":"","mnemonic":"corn wool actor cable marine anger nothing return coast energy magnet evolve best lion dutch clerk visit begin agree about sing federal sausage ribbon","accountAddress":"0xd97afeffa7ce00aa489e5c88880e124fb75b8e05"}
        });
    }

    return (
        <div>
            <h2 className="title is-3 has-text-white">Init wallet</h2>

            <div className="field">
                <label className="label">Rocket pool node password</label>
                <p className="help">This is the password that will encrypt your keystore - minimum length  =  12 characters</p>
            </div>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <input className="input" type={passwordFieldType} onChange={(e) => { setPassword(e.target.value) }} />

                </div>
                <div className="control">
                    <a onClick={toggleViewPassword} className="button is-link is-light"><FontAwesomeIcon
                        className="icon is-small is-right avadoiconpadding"
                        icon={passwordFieldIcon}
                    />
                    </a></div>
            </div>

            <div className="field">
                <label className="label">Verify Password</label>
                <div className="control">
                    <input className="input" type={passwordFieldType} onChange={(e) => { setVerifyPassword(e.target.value) }} />
                </div>
                {password && (
                    <p className="help is-danger">{passwordFeedback}</p>
                )}
                
                {/* {password && password.length > 0 && password === verifyPassword && (
                    <p className="help is-success">passwords match :)</p>
                )} */}
            </div>

            <button onClick={initWallet} disabled={buttonDisabled}>Init Wallet</button>

        </div>
    );
};

export default InitWallet