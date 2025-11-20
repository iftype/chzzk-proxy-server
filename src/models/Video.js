class Video {
  #videoPK;
  #channelPK;
  #videoId;
  #videoTitle;
  #videoThumbnailUrl;
  #videoDuration;
  #publishDate;

  constructor({
    videoPK = null,
    videoId,
    videoTitle,
    channelPK = null,
    publishDate,
    videoThumbnailUrl,
    videoDuration,
  } = {}) {
    this.#videoPK = videoPK;
    this.#videoId = videoId;
    this.#videoTitle = videoTitle;
    this.#channelPK = channelPK;
    this.#publishDate = publishDate;
    this.#videoThumbnailUrl = videoThumbnailUrl;
    this.#videoDuration = videoDuration;
  }

  get videoPK() {
    return this.#videoPK;
  }

  get videoId() {
    return this.#videoId;
  }

  static fromDBRow(row) {
    if (!row) return new Video({});
    return new Video({
      videoPK: row.id,
      videoId: row.video_id,
      videoTitle: row.video_title,
      channelPK: row.channel_pk,
      publishDate: row.publish_date,
      videoThumbnailUrl: row.video_thumbnail_url,
      videoDuration: row.video_duration,
    });
  }

  toDB() {
    return {
      video_id: this.#videoId,
      video_title: this.#videoTitle,
      channel_pk: this.#channelPK,
      publish_date: this.#publishDate,
      video_thumbnail_url: this.#videoThumbnailUrl,
      video_duration: this.#videoDuration,
    };
  }
}
export default Video;
