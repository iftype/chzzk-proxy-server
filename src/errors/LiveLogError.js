import HTTP_STATUS from "../constants/httpStatus.js";

class LiveLogError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "LiveLogError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LiveLogError);
    }
  }

  static NOT_FOUND() {
    return new LiveLogError("데이터를 찾을 수 없습니다", HTTP_STATUS.NOT_FOUND);
  }

  static BAD_REQUEST() {
    return new LiveLogError("잘못된 요청입니다. ", HTTP_STATUS.BAD_REQUEST);
  }

  static INTERNAL() {
    return new LiveLogError("서버 에러 발생", HTTP_STATUS.INTERNAL_ERROR);
  }
}
export default LiveLogError;
