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
