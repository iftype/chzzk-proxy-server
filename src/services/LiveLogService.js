import axios from "axios";
import LiveLog from "../models/LiveLog.js";
import MOCKDATA from "../../mock.js";

class LiveService {
  #API_BASE_URL = process.env.API_BASE_URL;
  liveLogRepository;

  constructor({ liveLogRepository }) {
    this.liveLogRepository = liveLogRepository;
  }

  // 채널대로 API 호출 후 카테고리 비교 후 저장
  // polling에서 사용
  async updateChannelStatus(channelId) {
    // 방송 중 아니면 return
    const channelInstance = await this.#getChannelData(channelId);
    if (channelInstance.error) {
      console.log(`[서비스 풀링 error발생]  (${channelInstance.error})`);
      return;
    }
    if (!(channelInstance instanceof LiveLog)) {
      console.log(`[서비스 Polling Error (instance)]()`);
      return;
    }
    if (channelInstance.status === "CLOSE") {
      console.log("방송 중이 아님");
      return channelInstance.toPollingData();
    }
    this.#saveChannelData(channelInstance);
  }

  // 한 채널의 정보 전부 가져오기
  getStoredChannelData(channelId) {
    return this.liveLogRepository.findAllByChannel(channelId);
  }

  // DB에 채널 데이터 저장하기
  #saveChannelData(channel) {
    this.liveLogRepository.save(channel);
  }

  // polling에서 사용
  async #getChannelData(channelId) {
    const currentTimeHex = Date.now().toString(16);
    const dtValue = currentTimeHex.slice(-5);
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v3.2/channels/${channelId}/live-detail?dt=${dtValue}`;
    console.log(`[서비스 풀링 요청]:  ${new Date().toLocaleTimeString()} 호출 `);

    // 데이터 모킹중
    return LiveLog.fromApiContent(MOCKDATA.content);
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
      return LiveLog.fromApiContent(content);
    } catch (error) {
      console.error("API 호출 오류:", error.message);
      return { error: error.message };
    }
  }
}
export default LiveService;
