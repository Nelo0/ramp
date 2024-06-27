import sql from './supabase.js'

async function getProcessedSignatures() {
    console.log("getting signatures: ")

    try {
        const signatures = await sql`
        select signature from processedsignatures where signatureid < 4;
      `
      console.log("signatures: ", signatures)
      // users = Result [{ name: "Walter", age: 80 }, { name: 'Murray', age: 68 }, ...]
      return signatures

    } catch (error) {
        console.log("error getting signatures: ", error)
    }
}
async function name() {
    await getProcessedSignatures()
}

name()
