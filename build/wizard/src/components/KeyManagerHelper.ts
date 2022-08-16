import { RestApi } from "./RestApi";

export class KeyManagerHelper {
    keyManagerAPI: RestApi;

    constructor(keyManagerAPI: RestApi) {
        this.keyManagerAPI = keyManagerAPI;
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

                // force page reload
                window.location.reload();
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