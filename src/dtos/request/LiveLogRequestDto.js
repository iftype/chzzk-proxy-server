import CHANNELS from "../../constants/channels.js";
class LiveLogRequestDto {
  channelName;

  constructor(req) {
    this.channelName = req.params.channelName?.toUpperCase() || null;
  }

  get streamerId() {
    return CHANNELS[this.channelName];
  }
}
export default LiveLogRequestDto;
