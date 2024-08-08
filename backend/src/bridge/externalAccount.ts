import bridgeDocs from '@api/bridge-docs';
import { RAMP_APIKEY } from '../utils/enviroment.js';

export interface ExternalAccountInfo {
    customerId: string;
    currency?: "usd" | "eur";
    bankName?: string;
    accountOwnerName: string;
    accountType?: "us" | "iban";
    account?: USAccountDetails;
    iban?: IbanAccountDetails;
    address?: AddressDetails; // Needed for US accounts
    accountOwnerType: "individual" | "business";
    firstName?: string;
    lastName?: string;
    businessName?: string;
}

interface USAccountDetails {
    [x: string]: unknown,
    account_number: string, //The bank account number
    routing_number: string, //The bank routing number
    checking_or_savings?: string, //Determines whether the US account is treated as checking or savings. All US accounts will be treated as checking by default.
    last_4: string,
}

interface IbanAccountDetails {
    [x: string]: unknown,
    account_number: string, //The International Bank Account Number (IBAN) that will be used to send the funds
    bic: string, //The Bank Identifier Code (BIC) that will be used to send the funds
    country: string, //Country in which the bank account is located. It's a three-letter alpha-3 country code as defined in the ISO 3166-1 spec.
    last_4: string,
}

interface AddressDetails {
    [x: string]: unknown,
    street_line_1: string,
    street_line_2?: string,
    city: string,
    state?: string, //ISO 3166-2 subdivision code. Must be supplied if the country has subdivisions.
    postal_code?: string, //Must be supplied for countries that use postal codes.
    country: string, //Three-letter alpha-3 country code as defined in the ISO 3166-1 spec.
}

export const createExternalAccount = (userInfo: ExternalAccountInfo) => {
    const { customerId, currency, bankName, accountOwnerName, accountType, iban, account, accountOwnerType, firstName, lastName, businessName, address } = userInfo;

    bridgeDocs.default.auth(RAMP_APIKEY);
    const data = bridgeDocs.default.postCustomersCustomeridExternal_accounts({
        id: "UUID that identifes the resource??", //TODO: Find out how to get this property
        currency: currency,
        bank_name: bankName,
        account_owner_name: accountOwnerName,
        account_type: accountType,
        account: account,
        iban: iban,
        account_owner_type: accountOwnerType,
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        address: address,
    }, { customerID: customerId })
        .then(({ data }) => {
            console.log(data)
            return data
        })
        .catch(err => console.error(err));

    return data
}

export const getUsersExternalAccounts = (userInfo: ExternalAccountInfo) => {
    const { customerId } = userInfo;

    bridgeDocs.default.auth(RAMP_APIKEY);
    const data = bridgeDocs.default.getCustomersCustomeridExternal_accounts({ customerID: customerId })
        .then(({ data }) => {
            console.log(data)
            return data
        })
        .catch(err => console.error(err));

    return data
}
