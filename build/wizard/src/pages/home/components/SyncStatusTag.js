import React from "react";

const SyncStatusTag = ({ progress }) => { // progress: a number between 0 and 1
    return (
        <span className={"tag" + (progress == 1 ? " is-success" : " is-warning")}>
            {parseFloat(progress * 100).toFixed(2) + "% synced"}
        </span>
    );
};

export default SyncStatusTag


