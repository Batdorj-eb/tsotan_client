export type Category = {
  id: number;
  name: string;
  nameEn?: string;
  parentId?: number;
};

export type Product = {
  id: number | string;
  name: string;
  nameEn?: string;
  price: number;
  usdPrice?: number;
  img?: string;
  image?: string[];
  description?: string;
  descriptionEn?: string;
  instruction?: string;
  instructionEn?: string;
  size?: string;
  sizeEn?: string;
  material?: string;
  materialEn?: string;
  parentCategory?: string;
  parentCategoryEn?: string;
  childCategory?: string;
  childCategoryEn?: string;
  category?: string;
  categoryEn?: string;
  categoryId?: number;
  isNew?: boolean;
  isSpecial?: boolean;
  stock?: number | null;
};

export type Banner = {
  id?: number;
  url: string;
  path?: string;
  type?: string;
  title?: string;
  titleEn?: string;
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
  nameEn?: string;
  price: number;
  usdPrice?: number;
  img?: string;
  quantity: number;
  stock?: number | null;
};

export type OrderItem = {
  id?: number | string;
  name: string;
  quantity: number;
  price?: number;
  img?: string;
};

export type Order = {
  id: number;
  phoneNumber?: string;
  customerName?: string;
  fb?: string;
  email?: string;
  address?: string;
  comment?: string;
  orderedProducts?: string;
  items?: OrderItem[];
  price: number;
  orderState: string;
  createdAt: string;
  qpayInvoiceId?: string;
  transactionInfo?: string;
};

export type ContactPage = {
  slug?: string;
  title?: string;
  intro?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapEmbed?: string;
  formTitle?: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  image: string;
  path?: string;
  sortOrder?: number;
  parentId?: number;
};

export type ServicePage = {
  title: string;
  intro: string;
  items: ServiceItem[];
};
