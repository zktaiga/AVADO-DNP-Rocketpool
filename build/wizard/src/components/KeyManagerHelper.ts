import { DappManagerHelper } from "./DappManagerHelper";
import { RestApi } from "./RestApi";
import { minipoolStatusType } from "./Types";

export class KeyManagerHelper {
    keyManagerAPI: RestApi;
    dappManagerHelper: DappManagerHelper;
    validatorPackage: string;

    constructor(keyManagerAPI: RestApi, dappManagerHelper: DappManagerHelper, validatorPackage: string) {
        this.keyManagerAPI = keyManagerAPI;
        this.dappManagerHelper = dappManagerHelper;
        this.validatorPackage = validatorPackage;
    }

    public static ERROR = "-1";

    public getFeeRecipient(pubKey: string): Promise<string> {
        return this.keyManagerAPI.get<string>(`/eth/v1/validator/${pubKey}/feerecipient`,
            (res) => {
                if (res.status === 200) {
                    // console.log(res)
                    const address = res.data.data.ethaddress;
                    if (address && address !== "0x0000000000000000000000000000000000000000")
                        return address
                    else
                        return KeyManagerHelper.ERROR
                } else {
                    return KeyManagerHelper.ERROR
                }
            }, (err) => {
                console.log("Error in validators_proposer_default_fee_recipient", err)
                return KeyManagerHelper.ERROR
            });
    }

    public setFeeRecipients(minipoolSatus: minipoolStatusType, feeRecipientAddress: string, refresh?: boolean ) {
        const pubKeys = minipoolSatus.minipools.map(minipool => minipool.validatorPubkey)
        console.log(`Setting feerecipient for ${pubKeys} to ${feeRecipientAddress}`)
        
        pubKeys.forEach(pubKey => this.setFeeRecipient(pubKey, feeRecipientAddress))

        if (this.validatorPackage.includes("eth2validator"))
            this.prysmFeeRecipientsWorkaround(pubKeys, feeRecipientAddress)

        //wait a bit and force a page reload
        if (refresh)
            setTimeout(() => window.location.reload(), 10000);
    }

    //workaround for Prysm because the keyManager API calls are not persisted: https://github.com/prysmaticlabs/prysm/issues/11322
    // 1. get default fee recipient
    //    * Get settings file from Prysm package
    //    * Parse settings file
    // 2. Create proposer file content
    //    * Default settings
    //    * One entry per validator
    // 3. Write proposer file
    // 4. Restart validator
    private async prysmFeeRecipientsWorkaround(pubKeys: string[], feeRecipientAddress: string) {

        const validatorSettings = await this.dappManagerHelper.getFileContentFromContainer("/root/settings.json", this.validatorPackage) ?? ""
        console.log(validatorSettings)
        const defaultFeeRecipient = JSON.parse(validatorSettings).validators_proposer_default_fee_recipient ?? "";
        const mevBoost = JSON.parse(validatorSettings)?.mevBoost ?? false;

        // Create content
        const proposer_configs = Object.fromEntries(new Map(pubKeys.map(key => {
            return ["0x"+key, {
                "fee_recipient": feeRecipientAddress,
                "builder": {
                    "enabled": mevBoost,
                    "gas_limit": 30000000
                }
            }
            ]
        })))
        const proposerConfig = {
            default_config: {
                fee_recipient: defaultFeeRecipient,
                builder: {
                    enabled: mevBoost,
                    gas_limit: 30000000
                }
            },
            proposer_config: proposer_configs
        }
        const proposerConfigFileContent = JSON.stringify(proposerConfig)

        console.log("Proposer Config File", proposerConfigFileContent)

        // Write file
        await this.dappManagerHelper.writeFileToContainer("proposer_settings.json", "/root/.eth2validators/", proposerConfigFileContent, this.validatorPackage)

        // Restart validator
        this.dappManagerHelper.restartPackage(this.validatorPackage)
    }

    public setFeeRecipient(pubKey: string, feeRecipientAddress: string) {
        console.log(`Setting feerecipient for ${pubKey} to ${feeRecipientAddress}`)
        this.keyManagerAPI.post(`/eth/v1/validator/${pubKey}/feerecipient`, {
            "ethaddress": feeRecipientAddress
        }, (res) => {
            console.log(res)
            if (res.status !== 202) {
                console.log(res.data)
            } else {
                console.log("Configured fee recipient via key manager: ", res)
            }
        }, (e) => {
            console.log("error", e.response.data.message)
        });

    }

    public async getValidators() {
        return await this.keyManagerAPI.get("/eth/v1/keystores",
            (res) => {
                if (res.status === 200) {
                    return (res.data.data.map((d: any) => d.validating_pubkey))
                } else {
                    console.log("error updating validators", res)
                }
            }, (e) => {
                console.log("error updating validators", e)
            });

    }



}