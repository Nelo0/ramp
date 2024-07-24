import * as dotenv from "dotenv"
dotenv.config()

const getEuroeApiToken = async () => {
    const url = 'https://accountapi.euroe.com/apiauth';
    const apiKey = process.env.EUROE_APIKEY;

    const options: RequestInit = {
        method: 'POST',
        //@ts-ignore
        headers: {
            'X-EUROEACCOUNT-API-KEY': apiKey,
            'Content-Length': '0'
        }
    };

    let apiHeader;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        apiHeader = response.headers.get('authorization');
    } catch (error) {
        console.error('Error:', error);
    }

    if (typeof apiHeader != "string") return ""
    return apiHeader;
}


const createBurnInstruction = async (token: string, amount: string) => {
    const url = 'https://accountapi.euroe.com/api/burn';
    const payload = {
        amount: `${amount}`,
        fromNetwork: "SOL",
        toAccount: "IE42REVO99036012196566"
    };

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Burn Instruction uuid:', data.uuid);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

const createMintInstruction = async (token: string) => {
    const url = 'https://accountapi.euroe.com/api/account';

    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

//This api call is broken on EUROe side
const cancelPaymentInstruction = async (token: string, instructionId: string) => {
    const url = `https://accountapi.euroe.com/api/paymentinstruction/${instructionId}`;
    console.log("Url: ", url)

    const options: RequestInit = {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Length': '0'
        }
    };
    console.log("options: ", options)


    try {
        const response = await fetch(url, options);
        console.log("Delete repsonse", await response.json())
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error!:', error);
    }
}

export const initiateEuroeBurn = async (amount: string) => {
    let bearerToken = await getEuroeApiToken()

    if (bearerToken == "") {
        //set bearerToken to be apikey
        throw Error("Couldn't get bearer token for euroe");
    }

    const burnInstructionData = await createBurnInstruction(bearerToken, amount);
    const burnAddress: string = burnInstructionData.fromAccount;
    const burnInstructionId = burnInstructionData.uuid;

    console.log("Burn address: ", burnAddress)
    console.log("Burn instruction ID: ", burnInstructionId)

    // TODO Store Instruction ID.
    return burnAddress;
}


const getAllMintAndBurns = async (token: string) => {
    const url = 'https://accountapi.euroe.com/api/paymentinstruction';

    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Payment Instruction data:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}