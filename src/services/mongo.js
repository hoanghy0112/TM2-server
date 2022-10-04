import 'dotenv/config'

import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.on('open', () => {
   console.log('Mongo connection is opened');
})

mongoose.connection.on('error', (error) => {
   console.log({ error });
})

export async function connectMongo() {
   await mongoose.connect(MONGO_URL)
}

export async function disconnectMongo() {
   await mongoose.disconnect()
}