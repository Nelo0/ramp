var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dotenv from "dotenv";
dotenv.config();
const getEuroeApiToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://accountapi.euroe.com/apiauth';
    const apiKey = process.env.EUROE_APIKEY;
    const options = {
        method: 'POST',
        //@ts-ignore
        headers: {
            'X-EUROEACCOUNT-API-KEY': apiKey,
            'Content-Length': '0'
        }
    };
    let apiHeader;
    try {
        const response = yield fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        apiHeader = response.headers.get('authorization');
    }
    catch (error) {
        console.error('Error:', error);
    }
    if (typeof apiHeader != "string")
        return "";
    return apiHeader;
});
const createBurnInstruction = (token, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://accountapi.euroe.com/api/burn';
    const payload = {
        amount: `${amount}`,
        fromNetwork: "SOL",
        toAccount: "IE42REVO99036012196566"
    };
    const options = {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: JSON.stringify(payload)
    };
    try {
        const response = yield fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log('Burn Instruction uuid:', data.uuid);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
});
const createMintInstruction = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://accountapi.euroe.com/api/account';
    const options = {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };
    try {
        const response = yield fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log('Response:', data);
    }
    catch (error) {
        console.error('Error:', error);
    }
});
//This api call is broken on EUROe side
const cancelPaymentInstruction = (token, instructionId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://accountapi.euroe.com/api/paymentinstruction/${instructionId}`;
    console.log("Url: ", url);
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Length': '0'
        }
    };
    console.log("options: ", options);
    try {
        const response = yield fetch(url, options);
        console.log("Delete repsonse", yield response.json());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log('Response:', data);
    }
    catch (error) {
        console.error('Error!:', error);
    }
});
export const initiateEuroeBurn = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    let bearerToken = yield getEuroeApiToken();
    if (bearerToken == "") {
        //set bearerToken to be apikey
        throw Error("Couldn't get bearer token for euroe");
    }
    const burnInstructionData = yield createBurnInstruction(bearerToken, amount);
    const burnAddress = burnInstructionData.fromAccount;
    const burnInstructionId = burnInstructionData.uuid;
    console.log("Burn address: ", burnAddress);
    console.log("Burn instruction ID: ", burnInstructionId);
    // TODO Store Instruction ID.
    return burnAddress;
});
const getAllMintAndBurns = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://accountapi.euroe.com/api/paymentinstruction';
    const options = {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };
    try {
        const response = yield fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log('Payment Instruction data:', data);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
});
