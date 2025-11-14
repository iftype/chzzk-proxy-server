import express from "express";
import axios from "axios";
import cors from "cors";

import "dotenv/config"; // dotenv 로드

// --- 1. 설정 및 상수 ---
const app = express();
const PORT = 4000;

const PAKA_ID = process.env.PAKA_CHANNEL_ID;
const RALO_ID = process.env.RALO_CHANNEL_ID;
// const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL || "60000");

const API_BASE_URL = "https://api.chzzk.naver.com";

async function getLiveStatus(channelId) {
  const currentTime = Date.now();
  const apiUrl = `${API_BASE_URL}/service/v3.2/channels/${channelId}/live-detail?dt=${currentTime}`;

  console.log(`[풀링 요청] ${new Date().toLocaleTimeString()} 호출`);
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    const { content } = response.data;
    return content;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}
app.use(cors());

app.get("/ralo-detail", async (req, res) => {
  const content = await getLiveStatus(RALO_ID);
  res.json({ channel: "RALO", data: content });
});

app.get("/paka-detail", async (req, res) => {
  const content = await getLiveStatus(PAKA_ID);
  res.json({ channel: "PAKA", data: content });
});

// mock
app.get("/test", async (req, res) => {
  res.json({ channel: "ok", data: { test: "al" } });
});

app.get("/", (req, res) => {
  res.send("서버 구동 중 /ralo-detail, /paka-detail");
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
