
export type networkType = "prater" | "mainnet"
export type consusClientType = "teku" | "prysm"

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/minipool.go
export type minipoolStatusType = {
  "status": "success" | "error",
  "error": string,
  "minipools": [
    {
      "address": string,
      "validatorPubkey": string,
      "status": {
        "status": string,
        "statusBlock": number,
        "statusTime": string
      },
      "depositType": string,
      "node": {
        "address": string,
        "fee": number,
        "depositBalance": number,
        "refundBalance": number,
        "depositAssigned": boolean
      },
      "user": {
        "depositBalance": number,
        "depositAssigned": boolean,
        "depositAssignedTime": string
      },
      "balances": {
        "eth": number,
        "reth": number,
        "rpl": number,
        "fixedSupplyRpl": number
      },
      "validator": {
        "exists": boolean,
        "active": boolean,
        "index": number,
        "balance": number,
        "nodeBalance": number
      },
      "canStake": boolean,
      "refundAvailable": boolean,
      "withdrawalAvailable": boolean,
      "closeAvailable": boolean,
      "finalised": boolean,
      "useLatestDelegate": boolean,
      "delegate": string,
      "previousDelegate": string,
      "effectiveDelegate": string,
      "timeUntilDissolve": number,
      "penalties": number
    }
  ],
  "latestDelegate": string
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
  "activeSnapshotProposals": [],
  "isFeeDistributorInitialized": boolean,
  "feeRecipientInfo": {
    "smoothingPoolAddress": string,
    "feeDistributorAddress": string,
    "isInSmoothingPool": boolean,
    "isInOptOutCooldown": boolean,
    "optOutEpoch": number
  },
  "feeDistributorBalance": number,
  "penalizedMinipools": {},
  "proposalVotes": []
}

//https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/wallet.go
export type walletStatusType = {
  "status": "success" | "error",
  "error": string,
  "passwordSet": boolean,
  "walletInitialized": boolean,
  "accountAddress": string
}

