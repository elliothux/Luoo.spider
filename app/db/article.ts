import { Collection } from "mongodb";
import { getDB } from "./utils";

export interface ArticleTask {
  id: number;
  cover: string;
  intro: string,
  done: boolean;
}

export interface Article {
  id: number;
  title: string;
  cover: string;
  intro: string;
  color: string,
  metaInfo: string;
  url: string;
  desc: string;
  author: string;
  authorAvatar: string;
  tracks: ArticleTrack[];
}

export interface ArticleTrack {
  id: number;
  articleId: number;
  name: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  color: string;
}

async function getArticleTaskCollection(): Promise<Collection> {
  const db = await getDB();
  return db.collection("article-tasks");
}

async function addArticleTask(taskInfo: ArticleTask) {
  const collection = await getArticleTaskCollection();
  return collection.insertOne(taskInfo);
}

async function doneArticleTask(id: number) {
  const collection = await getArticleTaskCollection();
  return collection.updateOne({ id }, { $set: { done: true } });
}

async function undoneArticleTasks() {
  const collection = await getArticleTaskCollection();
  return collection.updateMany({ done: true }, { $set: { done: false } });
}

async function isArticleTaskExist(id: number): Promise<boolean> {
  const collection = await getArticleTaskCollection();
  const count = await collection.countDocuments({ id });
  return count > 0;
}

async function getUnfinishedTasks(): Promise<ArticleTask[]> {
  const collection = await getArticleTaskCollection();
  return collection.find<ArticleTask>({ done: false }).toArray();
}

async function getArticleCollection(): Promise<Collection> {
  const db = await getDB();
  return db.collection("articles");
}

async function saveArticle(article: Article) {
  const collection = await getArticleCollection();
  return collection.insertOne(article);
}

export {
  addArticleTask,
  doneArticleTask,
  undoneArticleTasks,
  isArticleTaskExist,
  getUnfinishedTasks,
  saveArticle
};
