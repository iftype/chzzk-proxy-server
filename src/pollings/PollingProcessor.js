import PollingPolicy from "./PollingPolicy.js";

class PollingProcessor {
  #liveLogService;
  #channelService;
  #categoryService;

  #cache; // 직전 카테고리랑비교용

  constructor({ liveLogService, categoryService, channelService }) {
    this.#liveLogService = liveLogService;
    this.#categoryService = categoryService;
    this.#channelService = channelService;

    this.#cache = new Map();
  }
  // ChannelService 또는 PollingProcessor 초기화 로직 (의사 코드)

  async initializeCache(_channelId) {
    const liveLogRow = await this.#liveLogService.findLastLiveBroadcast(_channelId);
    if (!liveLogRow) return;
    const { channel_id } = await this.#channelService.getChannelByPK(liveLogRow.channel_id);
    const { name } = await this.#categoryService.getCategoryByPK(liveLogRow.live_category_id);
    this.#cache.set(channel_id, name);
  }

  async processPollingChannel(_channelId) {
    try {
      await this.#channelService.updateChannelState(_channelId);
      return PollingPolicy.getChannelInterval();
    } catch (error) {
      console.error(`[processPollingChannel] 에러 발생 `, error.message);
      return PollingPolicy.getOpenInterval();
    }
  }

  async processPollingLiveLog(_channelId) {
    try {
      const channelInstance = await this.#liveLogService.getLiveLogData(_channelId);
      if (!channelInstance) return PollingPolicy.getRetryInterval();

      const { channelId, liveTitle, openDate, closeDate, status, liveCategory, liveCategoryValue } =
        channelInstance.toDB();

      const cachedValue = this.#cache.get(channelId);
      const categoryChanged = cachedValue !== liveCategoryValue;

      if (status === "OPEN") {
        const channelIdKey = await this.#channelService.getOrCreateChannelId({ channelId });
        const categoryKey = await this.#categoryService.getOrCreateCategoryId({
          liveCategory,
          liveCategoryValue,
        });
        if (!channelIdKey || !categoryKey) {
          return PollingPolicy.getRetryInterval();
        }
        if (categoryChanged) {
          await this.#liveLogService.saveChannelData({
            channelId: channelIdKey,
            liveTitle,
            openDate,
            closeDate,
            categoryId: categoryKey,
          });
          this.#cache.set(channelId, liveCategoryValue);
        }
        return PollingPolicy.getOpenInterval();
      }
      // CLOSE
      this.#liveLogService.updateCloseDate({ channelId, closeDate, openDate });
      this.#cache.set(channelId, null);
      return PollingPolicy.getCloseInterval(closeDate);
    } catch (error) {
      console.error(`[PollingProcesseorLiveLog] 에러 발생 `, error.message);
      return PollingPolicy.getOpenInterval();
    }
  }
}
export default PollingProcessor;
