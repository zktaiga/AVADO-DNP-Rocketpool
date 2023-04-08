
export type networkType = "prater" | "mainnet"
export type consusClientType = "teku" | "prysm"

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/minipool.go
export type minipoolStatusType = {
  "status": "success" | "error",
  "error": string,
  "minipools": MinipoolDetailsType[],
  "latestDelegate": string,
  "isAtlasDeployed": boolean
}

export type MinipoolDetailsType = {
  "address": string,
  "validatorPubkey": string,
  "status": minipoolStatusDetailsType,
  "depositType": string,
  "node": NodeDetailsType,
  "user": UserDetailsType,
  "balances": balancesDetailType,
  "validator": validatorDetailsType,
  "canStake": boolean,
  // queue
  "refundAvailable": boolean,
  "withdrawalAvailable": boolean,
  "closeAvailable": boolean,
  "finalised": boolean,
  "useLatestDelegate": boolean,
  "delegate": string,
  "previousDelegate": string,
  "effectiveDelegate": string,
  "timeUntilDissolve": number,
  "penalties": number,
  "reduceBondTime": any,
	"reduceBondCancelled": boolean
}
export type minipoolStatusDetailsType = {
  "status": string,
  "statusBlock": number,
  "statusTime": string
}
export type NodeDetailsType = {
  "address": string,
  "fee": number,
  "depositBalance": number,
  "refundBalance": number,
  "depositAssigned": boolean
}
export type UserDetailsType = {
  "depositBalance": number,
  "depositAssigned": boolean,
  "depositAssignedTime": string
}
export type balancesDetailType = {
  "eth": number,
  "reth": number,
  "rpl": number,
  "fixedSupplyRpl": number
}
export type validatorDetailsType = {
    "exists": boolean,
    "active": boolean,
    "index": number,
    "balance": number,
    "nodeBalance": number
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/node.go
export type nodeStatusType = {
  "status": "success" | "error",
  "error": string,
  "accountAddress": string,
  "withdrawalAddress": string,
  "pendingWithdrawalAddress": string,
  "registered": boolean,
  "trusted": boolean,
  "timezoneLocation": string,
  "accountBalances": {
    "eth": number
    "reth": number,
    "rpl": number,
    "fixedSupplyRpl": number
  },
  "withdrawalBalances": {
    "eth": number
    "reth": number,
    "rpl": number,
    "fixedSupplyRpl": number
  },
  "rplStake": number,
  "effectiveRplStake": number,
  "minimumRplStake": number,
  "maximumRplStake": number,
  "collateralRatio": number,
  "votingDelegate": string,
  "minipoolLimit": number,
  "minipoolCounts": {
    "total": number,
    "initialized": number,
    "prelaunch": number,
    "staking": number,
    "withdrawable": number,
    "dissolved": number,
    "refundAvailable": number,
    "withdrawalAvailable": number,
    "closeAvailable": number,
    "finalised": number
  },
  "isFeeDistributorInitialized": boolean,
  "feeRecipientInfo": {
    "smoothingPoolAddress": string,
    "feeDistributorAddress": string,
    "isInSmoothingPool": boolean,
    "isInOptOutCooldown": boolean,
    "optOutEpoch": number
  },
  "feeDistributorBalance": number,
  "penalizedMinipools": [string],
  "snapshotResponse": {
    "error": string,
    "proposalVotes": []
    "activeSnapshotProposals": []
  }
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/node.go#L278
export type nodeSyncProgressResponseType = {
  "status": "success" | "error",
  "error": string,
  "ecStatus": ClientManagerStatusType,
  "bcStatus": ClientManagerStatusType
}
export type ClientManagerStatusType = {
  "primaryEcStatus": ClientStatusType,
  "fallbackEnabled": boolean,
  "fallbackEcStatus": ClientStatusType
}
export type ClientStatusType = {
  "isWorking": boolean
  "isSynced": boolean
  "syncProgress": number,
  "networkId": number
  "error": string
}

//https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/wallet.go
export type walletStatusType = {
  "status": "success" | "error",
  "error": string,
  "passwordSet": boolean,
  "walletInitialized": boolean,
  "accountAddress": string
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/network.go#L18
export type rplPriceDataType = {
  "status": string,
  "error": string,
  "rplPrice": bigint,
  "rplPriceBlock": number
  "minPer8EthMinipoolRplStake": bigint,
  "maxPer8EthMinipoolRplStake": bigint,
  "minPer16EthMinipoolRplStake": bigint,
  "maxPer16EthMinipoolRplStake": bigint
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/network.go#L9
export type nodeFeeType = {
  "status": string,
  "error": string,
  "nodeFee": number
  "minNodeFee": number
  "targetNodeFee": number
  "maxNodeFee": number
}