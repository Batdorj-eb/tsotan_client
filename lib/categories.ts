import type { Category } from "./types";

export function isRootCategory(category: Category) {
  return !category.parentId;
}

export function rootCategories(categories: Category[]) {
  return categories.filter(isRootCategory);
}

export function childCategories(categories: Category[], parentId: number) {
  return categories.filter((category) => category.parentId === parentId);
}
