import Category from "../models/Category.js";
class CategoryRepository {
  #pool;
  constructor(pool) {
    this.#pool = pool;
  }

  // 사용: 카테고리를 추가/업데이트 함
  async upsertCategory(category) {
    const sql = `
      INSERT INTO CHZZK_CATEGORIES (category_id, category_value, category_type, category_image_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (category_id) 
      DO UPDATE SET 
        category_value = EXCLUDED.category_value,
        category_type = EXCLUDED.category_type,
        category_image_url = EXCLUDED.category_image_url
      RETURNING *;
      `;
    const dbData = category.toDB();
    const binds = [
      dbData.category_id,
      dbData.category_value,
      dbData.category_type,
      dbData.category_image_url,
    ];
    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0] ? Category.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[CategoryRepository] 업셋 실패:", err.message);
      return null;
    }
  }
  // 사용: 카테고리를 아이디로 찾아서 반환
  async findByCategoryId(categoryId) {
    try {
      const sql = `
        SELECT * FROM CHZZK_CATEGORIES 
        WHERE category_id = $1;
      `;
      const binds = [categoryId];
      const res = await this.#pool.query(sql, binds);
      return res.rows[0] ? Category.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[CategoryRepository] 카테고리 찾기 실패:", err.message);
      return null;
    }
  }

  async findByCategoryPK(categoryPK) {
    const sql = `
      SELECT 
        id, category_id, category_value, category_type
      FROM CHZZK_CATEGORIES
      WHERE id = $1
      LIMIT 1
    `;
    try {
      const res = await this.#pool.query(sql, [categoryPK]);
      return res.rows[0] ? Category.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[CategoryRepository] findByPK 실패:", err.message);
      return null;
    }
  }

  async findAll() {
    try {
      const res = await this.#pool.query(`SELECT * FROM CHZZK_CATEGORIES`);
      return res.rows.map((row) => Category.fromDBRow(row));
    } catch (err) {
      console.error("[CategoryRepository] findAll 실패:", err.message);
      return [];
    }
  }

  // 사용: 카테고리 이미지 업데이트용
  async updateCategoryImage(category) {
    const { id, category_image_url } = category.toDB();
    if (!id || !category_image_url) {
      console.error("[CategoryRepository] 이미지 업데이트 실패: PK와 이미지 URL이 필요합니다.");
      return null;
    }
    const sql = `
        UPDATE CHZZK_CATEGORIES
        SET category_image_url = $1
        WHERE id = $2
        RETURNING id, category_id, category_value, category_type, category_image_url;
    `;
    const binds = [category_image_url, id];
    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0] ? Category.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[CategoryRepository] 이미지 업데이트 실패:", err.message);
      return null;
    }
  }
}
export default CategoryRepository;
