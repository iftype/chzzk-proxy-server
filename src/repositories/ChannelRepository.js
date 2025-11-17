export default class ChannelRepository {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  async upsertChannel({ channelId, channelName, channelImageUrl }) {
    const sql = `
      INSERT INTO CHZZK_CHANNELS (channel_id, channel_name, profile_image_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (channel_id) 
      DO UPDATE SET 
        channel_name = EXCLUDED.channel_name,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = CASE 
          WHEN 
            CHZZK_CHANNELS.channel_name IS DISTINCT FROM EXCLUDED.channel_name OR
            CHZZK_CHANNELS.profile_image_url IS DISTINCT FROM EXCLUDED.profile_image_url
          THEN NOW() 
          ELSE CHZZK_CHANNELS.updated_at 
        END
      RETURNING id;
    `;
    const binds = [channelId, channelName, channelImageUrl];
    try {
      const res = await this.pool.query(sql, binds);
      return res.rows[0] || null; // PK 반환 위해
    } catch (err) {
      console.error("[ChannelRepository] upsertChannel 실패:", err.message);
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

  // 채널 하나만 가져오기
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

  async findByPK({ channelPK }) {
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
