class Category {
  liveCategory; // 카테고리(영어)
  liveCategoryValue; // 라이브 카테고리 값(한글임)

  constructor({ liveCategory, liveCategoryValue }) {
    this.liveCategory = liveCategory || null;
    this.liveCategoryValue = liveCategoryValue || null;
  }

  toDB() {
    return {
      liveCategory: this.liveCategory,
      liveCategoryValue: this.liveCategoryValue,
    };
  }
}

export default Category;
