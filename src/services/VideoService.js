import getChzzkApiResponse from "../api/chzzk-Api.js";
import Video from "../models/Video.js";

class VideoService {
  #API_BASE_URL;
  #channelService;
  #videoRepository;

  constructor({ channelService, videoRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;
    this.#channelService = channelService;
    this.#videoRepository = videoRepository;
  }

  async insertVideo(video) {
    const videoData = video.toDB();
    const { channelId } = videoData;
    const channelPK = await this.#channelService.getChannelId(channelId);
    return await this.#videoRepository.insertVideo({ ...videoData, channelId: channelPK });
  }

  async getLastVideo(channelId) {
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v1/channels/${channelId}/videos?sortType=LATEST&size=1`;
    const resContent = await getChzzkApiResponse(apiUrl);
    return Video.fromApiContent(resContent);
  }
}
export default VideoService;
