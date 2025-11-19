export default class VideoRepository {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  async insertVideo({ videoId, title, channelId, publishDate, thumbnailUrl, duration }) {
    const sql = `
        INSERT INTO CHZZK_VIDEOS 
             (video_id, title, channel_id, publish_date, thumbnail_url, duration)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (video_id) DO NOTHING
        RETURNING id;
        `;
    const binds = [videoId, title, channelId, publishDate, thumbnailUrl, duration];
    try {
      const res = await this.pool.query(sql, binds);
      return res.rows.length > 0 ? res.rows[0].id : null;
    } catch (err) {
      console.error("[VideoRepository] insertVideo 실패:", err.message);
      return null;
    }
  }

  async findAll() {
    const sql = `SELECT * FROM CHZZK_CHANNELS`;
    try {
      const res = await this.pool.query(sql);
      return res.rows;
    } catch (err) {
      console.error("[ChannelRepository] findAll 실패:", err.message);
      return [];
    }
  }

  // 해당하는 id 값으로 찾기
  async findByChannel({ channelId }) {
    const sql = `SELECT * FROM CHZZK_CHANNELS WHERE channel_id = $1 LIMIT 1`;
    try {
      const res = await this.pool.query(sql, [channelId]);
      return res.rows[0] || null;
    } catch (err) {
      console.error(`[ChannelRepository] findByChannel 실패: ${err.message}`);
      return null;
    }
  }
  // 해당하는 키값으로 찾기

  async findByPK({ videoPK }) {
    const sql = `
      SELECT 
        id, channel_id, channel_name, profile_image_url 
      FROM CHZZK_CHANNELS
      WHERE id = $1
      LIMIT 1
    `;
    try {
      const res = await this.pool.query(sql, [channelPK]);
      return res.rows[0] || null;
    } catch (err) {
      console.error("[ChannelRepository] findByPK 실패:", err.message);
      return null;
    }
  }
}
