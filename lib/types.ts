export type Category = {
  id: number;
  name: string;
  parentId?: number;
};

export type Product = {
  id: number | string;
  name: string;
  price: number;
  usdPrice?: number;
  img?: string;
  image?: string[];
  description?: string;
  instruction?: string;
  size?: string;
  material?: string;
  parentCategory?: string;
  childCategory?: string;
  category?: string;
  categoryId?: number;
  isNew?: boolean;
  isSpecial?: boolean;
};

export type Banner = {
  id?: number;
  url: string;
  path?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  cta?: string;
  href?: string;
  description?: string;
  sortOrder?: number;
};

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  usdPrice?: number;
  img?: string;
  quantity: number;
};
