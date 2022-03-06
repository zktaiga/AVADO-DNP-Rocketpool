import React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ClickToCopy = ({ children, text }) => {
    const [copied, setCopied] = React.useState(false);
    return (

        <span className="icon-text">
            <span>{children}</span>&nbsp;
            <CopyToClipboard text={text}
                className="icon"
                onCopy={() => {
                    setCopied(true)
                    setTimeout(() => { setCopied(false) }, 2000);
                }}>
                <FontAwesomeIcon
                    icon={faCopy}
                />
            </CopyToClipboard>
            {copied && (<span className="is-size-6">&nbsp;Copied!</span>)}
        </span>
    )
}


export default ClickToCopy