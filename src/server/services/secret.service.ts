import type { SecretData } from "../models/secret.model.js";
import { v4 as uuidv4 } from "uuid";

const store: Record<string, SecretData> = {};

export const createSecret = (secret: string, password: string, maxViews: number = 3) => {
  const token = uuidv4();

  store[token] = {
    secret,
    password,
    attempts: 0,
    views: 0,
    maxViews,
  };

  return token;
};

export const viewSecret = (token: string, password: string) => {
  const data = store[token];

  if (!data) {
    throw new Error("⛔ Secret expired or not found");
  }

  if (data.attempts >= 3) {
    delete store[token];
    throw new Error("❌ Too many incorrect attempts");
  }

  if (data.password !== password) {
    data.attempts += 1;
    throw new Error(`❌ Incorrect password (${data.attempts}/3)`);
  }

  if (data.views >= data.maxViews) {
    delete store[token];
    throw new Error(`❌ Exceeded ${data.maxViews} views`);
  }

  data.views += 1;

  const secret = data.secret;

  if (data.views >= data.maxViews) {
    delete store[token];
  }

  return {
    secret,
    viewsLeft: data.maxViews - data.views,
  };
};