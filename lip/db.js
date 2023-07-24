import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb+srv://next-auth-guide:nextauth89@cluster0.4yv84tp.mongodb.net/auth-demo?retryWrites=true&w=majority');
  return client;
}

