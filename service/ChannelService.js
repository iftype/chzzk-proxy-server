import axios from "axios";
import Channel from "../models/Channel.js";

class ChannelService {
  #API_BASE_URL;
  channelRepository;

  constructor({ channelRepository }) {
    this.channelRepository = channelRepository;
    this.#API_BASE_URL = process.env.API_BASE_URL;
  }

  // DB에 저장된 채널 데이터 가져오기
  async getStoredChannelData(channelId) {}
  // DB에 채널 데이터 저장하기
  async saveChannelData(channel) {}

  // polling에서 사용
  async getChannelData(channelId) {
    const currentTimeHex = Date.now().toString(16);
    const dtValue = currentTimeHex.slice(-6);
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v3.2/channels/${channelId}/live-detail?dt=${dtValue}`;
    console.log(`[풀링 요청]${channelId} :  ${new Date().toLocaleTimeString()} 호출 `);
    return this.#getApiData(apiUrl);
  }

  // 💥조심해서 사용할 것!! API 실제 호출
  async #getApiData(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });
      const { content } = response.data;
      return Channel.fromApiContent(content);
    } catch (error) {
      console.error("API 호출 오류:", error.message);
      return { error: error.message };
    }
  }
}
export default ChannelService;
