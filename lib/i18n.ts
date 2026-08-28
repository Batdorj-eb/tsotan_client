export type Locale = "mn" | "en";

export const LOCALES: Locale[] = ["mn", "en"];
export const DEFAULT_LOCALE: Locale = "mn";
export const LANG_STORAGE_KEY = "tsotan-lang";

const mn = {
  nav: {
    home: "Нүүр хуудас",
    new: "Шинэ бараа",
    shop: "Бүтээгдэхүүн",
    service: "Үйлчилгээ",
    social: "Сошиал",
    contact: "Холбоо барих",
  },
  header: {
    categories: "Ангилал",
    cart: "Сагс",
    close: "Хаах",
    closeMenu: "Цэс хаах",
    menu: "Цэс",
    cartEmpty: "Сагсанд бараа байхгүй байна",
    total: "Нийт",
    viewCart: "Сагсыг харах",
    checkout: "Төлбөр",
    language: "Хэл",
  },
  footer: {
    menu: "Цэс",
    follow: "Follow us",
    contact: "Холбоо",
    address1: "Tsotan Textile Цотан Текстил",
    address2: "Төмөр замын 222-р байр, Замчид гудамж",
    address3: "Ulaanbaatar 16051, Mongolia",
  },
  home: {
    collection: "Коллекц",
    newArrivals: "Шинэ бараа",
    viewAll: "Бүгдийг харах",
    monthlyNew: "Шинэ бараа",
    monthlyNewText: "Энэ улирлын шинэ бүтээл",
    monthlyService: "Үйлчилгээ",
    monthlyServiceText: "Хэвлэл, хатгамал, лазер",
    visitTitle: "Дэлгүүрээр зочлох",
    visitCta: "Зочлох",
    heroDescription:
      "Монголын нэхмэл, хэвлэл, хатгамал болон захиалгат бүтээгдэхүүнийг нэг дороос.",
    shopNow: "Худалдан авах",
    slide: "Слайд {n}",
  },
  shop: {
    search: "Хайлт",
    searchPlaceholder: "Бараа хайх...",
    categories: "Ангилал",
    all: "Бүгд",
    eyebrow: "Дэлгүүр",
    count: "{from}–{to} / {count} бараа",
    sortFeatured: "Онцгой эхэнд",
    sortLow: "Үнэ — Багаас их рүү",
    sortHigh: "Үнэ — Ихээс бага руу",
    empty: "Бараа олдсонгүй.",
  },
  product: {
    noImage: "Зураггүй",
    special: "Онцгой",
    isNew: "Шинэ",
    soldOut: "Дууссан",
    addToCart: "Сагсанд нэмэх",
    stockLeft: "Үлдсэн нөөц: {n}",
    size: "Хэмжээ",
    material: "Материал",
    care: "Угаах заавар",
  },
  cart: {
    empty: "Сагс хоосон байна",
    shop: "Дэлгүүр",
    title: "Таны сагс",
    item: "Бараа",
    price: "Үнэ",
    qty: "Тоо",
    total: "Нийт",
    checkout: "Төлбөр төлөх",
  },
  checkout: {
    paidTitle: "Төлбөр амжилттай",
    paidBody:
      "Таны захиалгыг хүлээн авлаа. Бүртгүүлсэн дугаараар холбогдох болно. Баярлалаа.",
    backToShop: "Дэлгүүр рүү буцах",
    order: "Захиалга",
    sentTitle: "Амжилттай илгээлээ",
    qpayHint: "QPay-ээр төлнө үү. Төлсний дараа автоматаар баталгаажна.",
    received: "Таны захиалгыг хүлээн авлаа. Бид тун удахгүй холбогдоно.",
    title: "Төлбөр төлөх",
    name: "Нэр",
    email: "Имэйл",
    phone: "Утас",
    address: "Хаяг",
    note: "Хүргэлтийн нөхцөл",
    confirm: "Баталгаажуулах",
    summary: "Таны захиалга",
    total: "Нийт",
    error: "Захиалга илгээхэд алдаа гарлаа.",
  },
  contact: {
    title: "Холбоо барих",
    phone: "Утас",
    email: "Имэйл",
    address: "Хаяг",
    hours: "Цагийн хуваарь",
    feedback: "Санал хүсэлт",
    phoneNumber: "Утасны дугаар",
    send: "Илгээх",
    sent: "Амжилттай илгээлээ.",
    error: "Илгээхэд алдаа гарлаа.",
  },
  service: {
    title: "Манай үйлчилгээ",
    intro: "Хэвлэл, хатгамал, лазер болон захиалгат бүтээгдэхүүний үйлчилгээ.",
  },
  notFound: {
    title: "Хуудас олдсонгүй",
    home: "Нүүр хуудас",
  },
};

const en: typeof mn = {
  nav: {
    home: "Home",
    new: "New arrivals",
    shop: "Shop",
    service: "Services",
    social: "Social",
    contact: "Contact",
  },
  header: {
    categories: "Categories",
    cart: "Cart",
    close: "Close",
    closeMenu: "Close menu",
    menu: "Menu",
    cartEmpty: "Your cart is empty",
    total: "Total",
    viewCart: "View cart",
    checkout: "Checkout",
    language: "Language",
  },
  footer: {
    menu: "Menu",
    follow: "Follow us",
    contact: "Contact",
    address1: "Tsotan Textile",
    address2: "Building 222, Zamchid Street, Railway district",
    address3: "Ulaanbaatar 16051, Mongolia",
  },
  home: {
    collection: "Collection",
    newArrivals: "New arrivals",
    viewAll: "View all",
    monthlyNew: "New arrivals",
    monthlyNewText: "This season’s new pieces",
    monthlyService: "Services",
    monthlyServiceText: "Print, embroidery, laser",
    visitTitle: "Visit the shop",
    visitCta: "Visit",
    heroDescription:
      "Mongolian textiles, print, embroidery, and custom products — all in one place.",
    shopNow: "Shop now",
    slide: "Slide {n}",
  },
  shop: {
    search: "Search",
    searchPlaceholder: "Search products...",
    categories: "Categories",
    all: "All",
    eyebrow: "Shop",
    count: "{from}–{to} / {count} products",
    sortFeatured: "Featured first",
    sortLow: "Price — Low to high",
    sortHigh: "Price — High to low",
    empty: "No products found.",
  },
  product: {
    noImage: "No image",
    special: "Featured",
    isNew: "New",
    soldOut: "Sold out",
    addToCart: "Add to cart",
    stockLeft: "In stock: {n}",
    size: "Size",
    material: "Material",
    care: "Care",
  },
  cart: {
    empty: "Your cart is empty",
    shop: "Shop",
    title: "Your cart",
    item: "Product",
    price: "Price",
    qty: "Qty",
    total: "Total",
    checkout: "Checkout",
  },
  checkout: {
    paidTitle: "Payment successful",
    paidBody:
      "We received your order and will contact you at the number you provided. Thank you.",
    backToShop: "Back to shop",
    order: "Order",
    sentTitle: "Order placed",
    qpayHint: "Please pay with QPay. It will confirm automatically after payment.",
    received: "We received your order. We’ll be in touch shortly.",
    title: "Checkout",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    note: "Delivery notes",
    confirm: "Confirm order",
    summary: "Your order",
    total: "Total",
    error: "Could not send the order.",
  },
  contact: {
    title: "Contact",
    phone: "Phone",
    email: "Email",
    address: "Address",
    hours: "Hours",
    feedback: "Feedback",
    phoneNumber: "Phone number",
    send: "Send",
    sent: "Sent successfully.",
    error: "Could not send.",
  },
  service: {
    title: "Our services",
    intro: "Print, embroidery, laser, and custom product services.",
  },
  notFound: {
    title: "Page not found",
    home: "Home",
  },
};

export const messages = { mn, en };

export type MessageKey =
  | `nav.${keyof typeof mn.nav}`
  | `header.${keyof typeof mn.header}`
  | `footer.${keyof typeof mn.footer}`
  | `home.${keyof typeof mn.home}`
  | `shop.${keyof typeof mn.shop}`
  | `product.${keyof typeof mn.product}`
  | `cart.${keyof typeof mn.cart}`
  | `checkout.${keyof typeof mn.checkout}`
  | `contact.${keyof typeof mn.contact}`
  | `service.${keyof typeof mn.service}`
  | `notFound.${keyof typeof mn.notFound}`;

const contentEn: Record<string, string> = {
  Даавуу: "Fabric",
  Футболк: "T-shirts",
  Бүс: "Belts",
  Уут: "Bags",
  "Ширээний бүтээлэг": "Tablecloths",
  "Ширээний гол": "Table runners",
  "Амны алчуур": "Napkins",
  "Цүнх, Богц": "Bags & pouches",
  Аравч: "Cushions",
  "Буйдангын суудал": "Sofa covers",
  "Дэрний уут": "Pillowcases",
  "Холст хэвлэл": "Canvas prints",
  Хормогч: "Aprons",
  "Бэлэн хувцас": "Ready-to-wear",
  Бусад: "Other",
  Бүтээгдэхүүн: "Products",
  "DTF DTG хэвлэл": "DTF / DTG print",
  "Уут цүнх": "Bags",
  Хатгамал: "Embroidery",
  Лазер: "Laser",
  Шошго: "Labels",
  "Шүр шигтгээ": "Beadwork",
  "Худалдан авах": "Shop now",
  "Манай үйлчилгээ": "Our services",
  "Холбоо барих": "Contact",
  "Санал хүсэлт": "Feedback",
  "Шинэ бараа": "New arrivals",
  "Хэвлэл, хатгамал, лазер болон захиалгат бүтээгдэхүүний үйлчилгээ.":
    "Print, embroidery, laser, and custom product services.",
};

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
) {
  const [group, name] = key.split(".") as [keyof typeof mn, string];
  const table = messages[locale][group] as Record<string, string>;
  const fallback = messages.mn[group] as Record<string, string>;
  return interpolate(table[name] || fallback[name] || key, vars);
}

export function translateContent(locale: Locale, text?: string | null) {
  if (!text) return "";
  if (locale === "mn") return text;
  return contentEn[text] || text;
}

export function localized(locale: Locale, mn?: string | null, en?: string | null) {
  const a = (mn || "").trim();
  const b = (en || "").trim();
  if (locale === "en") return b || translateContent(locale, a) || a;
  return a || b;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "mn" || value === "en";
}
