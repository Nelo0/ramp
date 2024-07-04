import sql from './supabase.js'

export const getProcessedSignatures = async (limit: number) => {
    console.log("getting signatures: ")

    try {
        const signatures = await sql`
        select signature 
        from processedsignatures 
        order by timestamp desc
        limit ${limit};
      `
        return signatures

    } catch (error) {
        console.log("error getting signatures: ", error)
    }
}

export const addSignatures = async (signatures: string[]) => {
    console.log("getting signatures: ")

    const values = signatures.map(sig => [sig]);

    try {
        await sql`
            insert into processedsignatures (signature)
            values ${sql(values)}
        `;
        console.log("Signatures added successfully");
    } catch (error) {
        console.error("Error adding signatures: ", error);
    }
}


export const getUsersAddressArray = async () => {
    console.log("getting user addresses: ")

    try {
        const user_addresses = await sql`
        select wallet_address 
        from users ;      `

        if (user_addresses == undefined) {
            throw Error("Database call to get processed signatures retuned undefined")
        }
        const addresses: string[] = user_addresses.map(row => row.wallet_address);

        return addresses

    } catch (error) {
        console.log("error getting user addresses: ", error)
        throw Error("Error getting the Quartz user address list")
    }
}