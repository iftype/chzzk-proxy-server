class CategoryRepository {
  #pool;
  constructor(pool) {
    this.#pool = pool;
  }

  async upsertCategory({ liveCategory, liveCategoryValue }) {
    const sql = `
      INSERT INTO CHZZK_CATEGORIES (value, name)
      VALUES ($1, $2)
      ON CONFLICT (value) 
        DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
      `;
    const binds = [liveCategory, liveCategoryValue];
    try {
      const res = await this.#pool.query(sql, binds);
      console.log(`[CategoryRepository] 카테고리 저장/업데이트`);
      return res.rows[0];
    } catch (err) {
      console.error("[CategoryRepository] 업셋 실패:", err.message);
      return null;
    }
  }

  async findByCategory({ liveCategory }) {
    try {
      const res = await this.#pool.query("SELECT * FROM CHZZK_CATEGORIES WHERE value = $1", [
        liveCategory,
      ]);
      console.log(`[CategoryRepository] 카테고리 아이디 가져오기`);
      return res.rows[0];
    } catch (err) {
      console.error("[CategoryRepository] 카테고리 찾기 실패:", err.message);
      return null;
    }
  }

  async findAll() {
    try {
      const res = await this.#pool.query(`SELECT id, value, name FROM CHZZK_CATEGORIES`);
      console.log("[CategoryRepository] 카테고리 전부 찾기");
      return res.rows; // [{id, value, name}, ...]
    } catch (err) {
      console.error("[CategoryRepository] findAll 실패:", err.message);
      return [];
    }
  }

  async findByPK({ categoryPK }) {
    const sql = `
      SELECT 
        id, value, name 
      FROM CHZZK_CATEGORIES
      WHERE id = $1
      LIMIT 1
    `;
    try {
      const res = await this.#pool.query(sql, [categoryPK]);
      return res.rows[0] || null;
    } catch (err) {
      console.error("[CategoryRepository] findByPK 실패:", err.message);
      return null;
    }
  }
}
export default CategoryRepository;
