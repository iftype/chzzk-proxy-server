class Category {
  #categoryPK;
  #categoryId;
  #categoryValue;
  #categoryType;
  #categoryImageUrl;

  constructor({
    categoryPK = null,
    categoryId,
    categoryValue,
    categoryType,
    categoryImageUrl = null,
  }) {
    this.#categoryPK = categoryPK;
    this.#categoryId = categoryId;
    this.#categoryValue = categoryValue;
    this.#categoryType = categoryType;
    this.#categoryImageUrl = categoryImageUrl;
  }

  get categoryPK() {
    return this.#categoryPK;
  }

  get categoryId() {
    return this.#categoryId;
  }

  toDB() {
    return {
      id: this.#categoryPK,
      category_id: this.#categoryId,
      category_value: this.#categoryValue,
      category_type: this.#categoryType,
      category_image_url: this.#categoryImageUrl,
    };
  }

  static fromDBRow(row) {
    if (!row) return null;
    return new Category({
      categoryPK: row.id,
      categoryId: row.category_id,
      categoryValue: row.category_value,
      categoryType: row.category_type,
      categoryImageUrl: row.category_image_url,
    });
  }
}
export default Category;
