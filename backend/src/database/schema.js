var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sql from './supabase.js';
export const getProcessedSignatures = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getting signatures: ");
    try {
        const signatures = yield sql `
        select signature 
        from processedsignatures 
        order by timestamp desc
        limit ${limit};
      `;
        return signatures;
    }
    catch (error) {
        console.log("error getting signatures: ", error);
    }
});
export const addSignatures = (signatures) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getting signatures: ");
    const values = signatures.map(sig => [sig]);
    try {
        yield sql `
            insert into processedsignatures (signature)
            values ${sql(values)}
        `;
        console.log("Signatures added successfully");
    }
    catch (error) {
        console.error("Error adding signatures: ", error);
    }
});
export const getUsersAddressArray = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getting user addresses: ");
    try {
        const user_addresses = yield sql `
        select wallet_address 
        from users ;      `;
        if (user_addresses == undefined) {
            throw Error("Database call to get processed signatures retuned undefined");
        }
        const addresses = user_addresses.map(row => row.wallet_address);
        return addresses;
    }
    catch (error) {
        console.log("error getting user addresses: ", error);
        throw Error("Error getting the Quartz user address list");
    }
});
