import { Collection } from "mongodb";
import { getDB } from "./utils";

interface Single {
  id: number;
  fromId: number;
  name: string;
  artist: string;
  cover: string;
  desc: string;
  date: number;
  recommender: string;
  url: string;
  color: string;
}

async function getSingleCollection(): Promise<Collection> {
  const db = await getDB();
  return db.collection("singles");
}

async function isSingleExist(date: number): Promise<Boolean> {
  const collection = await getSingleCollection();
  const count = await collection.countDocuments({ date });
  return count > 0;
}

async function saveSingle(single: Single) {
  const collection = await getSingleCollection();
  return collection.insertOne(single);
}

export { Single, getSingleCollection, saveSingle, isSingleExist };
