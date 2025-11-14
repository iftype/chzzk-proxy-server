class Channel {
  channelId; //현재 채널 ID;
  liveTitle; // 제목
  status; // 방송 중인지 OPEN / CLOSE
  openDate; // 방송 시작 날짜
  closeDate; // 방송 종료 날짜
  liveCategory; // 카테고리
  liveCategoryValue; // 라이브 카테고리 값(한글임)

  constructor({
    channelId,
    liveTitle,
    status,
    openDate,
    closeDate,
    liveCategory,
    liveCategoryValue,
  }) {
    this.channelId = channelId || null;
    this.liveTitle = liveTitle || null;
    this.status = status || "CLOSE";
    this.openDate = openDate ? new Date(openDate) : null;
    this.closeDate = closeDate ? new Date(closeDate) : null;
    this.liveCategory = liveCategory || null;
    this.liveCategoryValue = liveCategoryValue || null;
  }

  static fromApiContent(content) {
    if (!content) {
      return new Channel({});
    }
    return new Channel({
      channelId: content.channel?.channelId || content.channelId || null,
      liveTitle: content.liveTitle,
      status: content.status === "OPEN" ? "OPEN" : "CLOSE",
      openDate: content.openDate,
      closeDate: content.closeDate,
      liveCategory: content.liveCategory,
      liveCategoryValue: content.liveCategoryValue,
    });
  }

  //-----------------getter------------------
  get id() {
    return this.channelId;
  }

  get title() {
    return this.liveTitle;
  }

  get category() {
    return this.liveCategoryValue;
  }

  get isLive() {
    return this.status === "OPEN";
  }

  get startTimeString() {
    return this.openDate ? this.openDate.toISOString() : null;
  }

  toJSON() {
    return {
      id: this.channelId,
      title: this.liveTitle,
      isLive: this.isLive,
      category: this.category,
      startTime: this.startTimeString,
    };
  }
}

export default Channel;
