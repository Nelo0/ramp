import bridgeDocs from '@api/bridge-docs';
import { RAMP_APIKEY } from '../utils/enviroment.js';

export interface LiquidationHistoryInfo {
    customerId: string,
    paymentRail: "ach" | "wire" | "sepa" | "ach_push" | "swift",
    outputCurrency: "usd" | "eur",
    toBankAccountId: string,
    wireMessage?: string,
    sepaMessage?: string,
    swiftMessage?: string,
    liquidationAddressId?: string,
}

export const createLiquidationAddress = (userInfo: LiquidationHistoryInfo) => {
    const { customerId, paymentRail, outputCurrency, toBankAccountId, wireMessage, sepaMessage, swiftMessage } = userInfo;

    bridgeDocs.default.auth(RAMP_APIKEY);
    const data = bridgeDocs.default.postCustomersCustomeridLiquidation_addresses({
        chain: 'solana',
        currency: 'usdc',
        external_account_id: toBankAccountId,
        destination_wire_message: wireMessage,
        destination_sepa_reference: sepaMessage,
        destination_swift_reference: swiftMessage,
        destination_payment_rail: paymentRail,
        destination_currency: outputCurrency,
        custom_developer_fee_percent: '0.5'
    }, { customerID: customerId })
        .then(({ data }) => {
            console.log(data)
            return data
        })
        .catch(err => {
            console.error(err)
            throw err
        });

    return data
}

export const getLiqAddressHistory = (userInfo: LiquidationHistoryInfo) => {
    const { customerId, liquidationAddressId } = userInfo;

    if (!liquidationAddressId) throw Error("Get liq address history call requires a valid liquidiationAddressId")

    bridgeDocs.default.auth(RAMP_APIKEY);
    const data = bridgeDocs.default.getCustomersCustomeridLiquidation_addressesLiquidationaddressidDrains({ customerID: customerId, liquidationAddressID: liquidationAddressId })
        .then(({ data }) => {
            console.log(data)
            return data
        })
        .catch(err => {
            console.error(err)
            throw err
        });

    return data
}
