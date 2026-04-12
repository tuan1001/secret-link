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
    throw new Error("⛔ Secret không tồn tại");
  }

  if (data.attempts >= 3) {
    delete store[token];
    throw new Error("❌ Quá 3 lần nhập sai");
  }

  if (data.password !== password) {
    data.attempts += 1;
    throw new Error(`❌ Sai mật khẩu (${data.attempts}/3)`);
  }

  if (data.views >= data.maxViews) {
    delete store[token];
    throw new Error(`❌ Đã xem quá ${data.maxViews} lần`);
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