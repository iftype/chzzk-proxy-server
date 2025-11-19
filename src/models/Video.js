class Video {
  videoId; // 치지직 비디오 아이디
  title; // VIDEO 제목
  channelId; // PK
  publishDate; // video 업데이트시간
  thumbnailUrl; // 이미지
  duration; // 영상 시간

  constructor({ videoId, title, channelId, publishDate, thumbnailUrl, duration }) {
    this.videoId = videoId || null;
    this.title = title || null;
    this.channelId = channelId || null;
    this.publishDate = new Date(publishDate) || null;
    this.thumbnailUrl = thumbnailUrl || null;
    this.duration = duration || null;
  }

  static fromApiContent(content) {
    if (!content) {
      return new Video({});
    }
    const data = content.data[0];
    const { videoNo, videoTitle, publishDateAt, thumbnailImageUrl, duration } = data;
    const { channelId } = data.channel;
    return new Video({
      videoId: videoNo,
      title: videoTitle,
      publishDate: publishDateAt,
      channelId,
      thumbnailUrl: thumbnailImageUrl,
      duration,
    });
  }

  toDB() {
    const { videoId, title, channelId, publishDate, thumbnailUrl, duration } = this;
    return {
      videoId,
      title,
      publishDate,
      channelId,
      thumbnailUrl,
      duration,
    };
  }
}
export default Video;
