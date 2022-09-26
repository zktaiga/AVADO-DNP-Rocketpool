import React from "react";

interface Props {
    progress: number, // progress: a number between 0 and 1
    label?: string
}

const SyncStatusTag = ({ progress, label }: Props) => {
    return (
        <span className={"tag" + (progress === 1 ? " is-success" : " is-warning")}>
            {(label ? `${label} ` : "") + (Math.floor(progress * 100 * 100) / 100).toFixed(2) + "% synced"}
        </span>
    );
};

export default SyncStatusTag


