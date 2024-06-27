import postgres from 'postgres'
import * as dotenv from "dotenv"
dotenv.config()

const connectionString = process.env.DATABASE_URL
console.log(connectionString)
const sql = postgres(connectionString!)

//console.log("Connection: ", sql)

export default sql
