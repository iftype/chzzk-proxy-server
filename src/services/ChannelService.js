import getChzzkApiResponse from "../api/chzzk-Api.js";
import Channel from "../models/Channel.js";

class ChannelService {
  #API_BASE_URL;
  #channelRepository;

  constructor({ channelRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;
    this.#channelRepository = channelRepository;
  }

  // 다가져오기
  async getChannelAllData() {
    return await this.#channelRepository.findAll();
  }

  async getChannelData(channelId) {
    return await this.#channelRepository.findByChannel({ channelId });
  }

  async getChannelByPK(channelPK) {
    return await this.#channelRepository.findByPK({ channelPK });
  }

  async getChannelId(channelId) {
    const channelRow = await this.#channelRepository.findByChannel({ channelId });
    return channelRow.id;
  }

  async getOrCreateChannelId({ channelId }) {
    const channelData = await this.getChannelData(channelId);

    if (channelData?.id) {
      return channelData.id;
    }
    const newChannelData = await this.updateChannelState(channelId);
    return newChannelData?.id ?? null;
  }

  async updateChannelState(channelId) {
    const channelInstance = await this.getChannel(channelId);
    if (!(channelInstance instanceof Channel)) {
      console.log(`[채널 서비스 Polling Error not instance of Channel]`);
      return null;
    }
    const channelRow = channelInstance.toDB();
    return await this.#channelRepository.upsertChannel(channelRow);
  }

  async getChannel(channelId) {
    const apiUrl = `${this.#API_BASE_URL}/service/v1/channels/${channelId}`;
    console.log(`[서비스 풀링 요청]:  ${new Date().toLocaleTimeString()} 호출 `);

    const resContent = await getChzzkApiResponse(apiUrl);
    return new Channel(resContent);
  }
}
export default ChannelService;
