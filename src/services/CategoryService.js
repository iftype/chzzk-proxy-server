class CategoryService {
  #categoryRepo;
  constructor({ categoryRepository }) {
    this.#categoryRepo = categoryRepository;
  }
  async updateCategory({ liveCategory, liveCategoryValue }) {
    return await this.#categoryRepo.upsertCategory({ liveCategory, liveCategoryValue });
  }
  async getCategories() {
    return await this.#categoryRepo.findAll();
  }

  async getOrCreateCategoryId({ liveCategory, liveCategoryValue }) {
    const categoryData = await this.#categoryRepo.findByCategory({ liveCategory });

    if (categoryData?.id) {
      return categoryData.id;
    }
    const newCategoryData = await this.updateCategory({ liveCategory, liveCategoryValue });
    return newCategoryData?.id ?? null;
  }

  async getCategoryByPK(categoryPK) {
    return await this.#categoryRepo.findByPK({ categoryPK });
  }
}
export default CategoryService;
