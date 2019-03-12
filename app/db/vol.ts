import { MongoClient, Db, Collection } from "mongodb";
import config from "../../config";
import { getDB } from "./utils";
import { formatDesc } from "../utils";

interface VolTask {
  id: number;
  vol: number;
  title: string;
  link: string;
  done: boolean;
}

interface VolInfo {
  id: number;
  vol: number;
  title: string;
  link: string;
  cover: string;
  color: string;
  author: string;
  authorAvatar: string;
  date: string;
  desc: string;
  tags: string[];
  similarVols: number[];
  tracks: VolTrack[];
}

export interface VolTrack {
  id: number;
  volId: number;
  name: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  color: string;
}

async function getVolTaskCollection(): Promise<Collection> {
  const db = await getDB();
  return db.collection("vol-tasks");
}
async function addVolTask(taskInfo: VolTask) {
  const collection = await getVolTaskCollection();
  return collection.insertOne(taskInfo);
}
async function doneVolTask(id: number) {
  const collection = await getVolTaskCollection();
  return collection.updateOne({ id }, { $set: { done: true } });
}
async function undoneVolTasks() {
  const collection = await getVolTaskCollection();
  return collection.updateMany({ done: true }, { $set: { done: false } });
}
async function isVolTaskExist(id: number): Promise<boolean> {
  const collection = await getVolTaskCollection();
  const count = await collection.countDocuments({ id });
  return count > 0;
}

async function getUnfinishedTasks(): Promise<VolTask[]> {
  const collection = await getVolTaskCollection();
  return collection.find<VolTask>({ done: false }).toArray();
}

async function getVolCollection(): Promise<Collection> {
  const db = await getDB();
  return db.collection("vols");
}
async function saveVol(vol: VolInfo) {
  const collection = await getVolCollection();
  return collection.insertOne(vol);
}

// (async () => {
//   const collection = await getVolCollection();
//   const vols = (await collection.find({}).toArray()) as VolInfo[];
//   for (let vol of vols) {
//     const { tracks } = vol;
//     await collection.updateOne(
//       { id: vol.id },
//       {
//         $set: {
//           tracks: tracks.filter(i => !!i).map(track => {
//             delete track.vol;
//             track.volId = vol.id;
//             return track;
//           })
//         }
//       }
//     );
//     console.log(`set ${vol.vol} ${vol.title}`);
//   }
// })()
//   .then(console.log)
//   .catch(console.error);

export {
  VolInfo,
  VolTask,
  getVolCollection,
  addVolTask,
  doneVolTask,
  isVolTaskExist,
  getUnfinishedTasks,
  undoneVolTasks,
  saveVol
};
