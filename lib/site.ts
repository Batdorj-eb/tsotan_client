export const site = {
  name: "Tsotan",
  phone: "+976 9330 0991",
  phoneHref: "tel:+97693300991",
  email: "tsotan.factory@gmail.com",
  address: [
    "Tsotan Textile Цотан Текстил",
    "Төмөр замын 222-р байр, Замчид гудамж",
    "Ulaanbaatar 16051, Mongolia",
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/tsotantextile" },
    { label: "Instagram", href: "https://www.instagram.com/tsotan_mongolia/" },
    { label: "Twitter", href: "https://twitter.com/@Tsotan_textile" },
    { label: "Youtube", href: "https://www.youtube.com/" },
  ],
};

export const nav = [
  { href: "/", key: "nav.home" as const },
  { href: "/shop-new", key: "nav.new" as const },
  { href: "/shop", key: "nav.shop" as const, mega: true },
  { href: "/service", key: "nav.service" as const },
  { href: "/#social", key: "nav.social" as const },
  { href: "/contact", key: "nav.contact" as const },
];

export const fallbackCategories = [
  { id: 1000, name: "Даавуу", nameEn: "Fabric" },
  { id: 1100, name: "Футболк", nameEn: "T-shirts" },
  { id: 1200, name: "Бүс", nameEn: "Belts" },
  { id: 1700, name: "Уут", nameEn: "Bags" },
  { id: 1300, name: "Ширээний бүтээлэг", nameEn: "Tablecloths" },
  { id: 1400, name: "Ширээний гол", nameEn: "Table runners" },
  { id: 1500, name: "Амны алчуур", nameEn: "Napkins" },
  { id: 1600, name: "Цүнх, Богц", nameEn: "Bags & pouches" },
  { id: 1800, name: "Аравч", nameEn: "Cushions" },
  { id: 1900, name: "Буйдангын суудал", nameEn: "Sofa covers" },
  { id: 2000, name: "Дэрний уут", nameEn: "Pillowcases" },
  { id: 2100, name: "Холст хэвлэл", nameEn: "Canvas prints" },
  { id: 2200, name: "Хормогч", nameEn: "Aprons" },
  { id: 2300, name: "Бэлэн хувцас", nameEn: "Ready-to-wear" },
  { id: 2400, name: "Бусад", nameEn: "Other" },
];

export const services = [
  { title: "Бүтээгдэхүүн", image: "/images/services/products.jpg" },
  { title: "DTF DTG хэвлэл", image: "/images/services/dtf.png" },
  { title: "Уут цүнх", image: "/images/services/bags.jpg" },
  { title: "Хатгамал", image: "/images/services/embroidery.jpg" },
  { title: "Лазер", image: "/images/services/laser.png" },
  { title: "Шошго", image: "/images/services/label.jpg" },
  { title: "Шүр шигтгээ", image: "/images/services/beads.jpg" },
  { title: "Холст хэвлэл", image: "/images/services/canvas.jpg" },
];

export const heroSlides = [
  {
    eyebrow: "Tsotan",
    title: "Mongolia",
    subtitle: "Футболк",
    href: "/shop",
    cta: "Худалдан авах",
    image: "/images/aravch.jpg",
  },
  {
    eyebrow: "Аравч",
    title: "Таван нүдэн",
    subtitle: "аравч 2023",
    href: "/shop",
    cta: "Худалдан авах",
    image: "/images/aravch.jpg",
  },
];
