class ApiVideoDTO {
  #videoNo;
  #videoTitle;
  #publishDate;
  #thumbnailImageUrl;
  #videoDuration;
  #channelId;

  constructor(apiContent) {
    if (!apiContent || !apiContent?.data[0] || !apiContent.data[0].channel) {
      return;
    }
    const videoData = apiContent.data[0];

    this.#videoNo = videoData.videoNo ?? null;
    this.#videoTitle = videoData.videoTitle ?? null;
    this.#publishDate = videoData.publishDate ?? null;
    this.#thumbnailImageUrl = videoData.thumbnailImageUrl ?? null;
    this.#videoDuration = videoData.duration ?? null;
    this.#channelId = videoData.channel.channelId;
  }

  toDomainFields() {
    return {
      videoNo: this.#videoNo,
      videoTitle: this.#videoTitle,
      publishDate: this.#publishDate,
      videoThumbnailUrl: this.#thumbnailImageUrl,
      videoDuration: this.#videoDuration,
      channelId: this.#channelId,
    };
  }
}
export default ApiVideoDTO;
