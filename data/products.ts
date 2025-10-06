// data/products.ts

export type Product = {
  id: number;
  name: string;
  category: "male" | "female";
  subCategory: string;
  ageGroup: "adult" | "children" | "baby";
  price: number;
  isNew?: boolean;
  isFeatured?: boolean;
  image: string;
  hoverImage?: string;
  description?: string; // ✅ Add this if needed
};

export const maleCategories: Record<string, string> = {
  senator: "Senator (Owanbe)",
  ankara: "Ankara",
  corporate: "Corporate",
  vintage: "Vintage",
};

export const femaleCategories: Record<string, string> = {
  owanbe: "Owanbe Classical",
  bridal: "Bridal/Ankara",
  corset: "Corset/Padded",
  gowns: "Gowns",
  blouse: "Blouse",
  skirts: "Skirts",
  iro: "Iro and Buba",
  corporate: "Corporate",
  vintage: "Vintage",
  boubou: "Boubou dress",
  baby: "Baby Gown",
};

export const products: Product[] = [
  {
    id: 1,
    name: "Traditional Agbada Set",
    category: "male",
    subCategory: "senator",
    ageGroup: "adult",
    price: 50,
    isNew: true,
    isFeatured: true,
    image: "/images/agbada.jpg",
    hoverImage: "/images/agbada.jpg",
    description:
      "Elegant traditional Agbada set crafted with premium fabric. Perfect for special occasions and cultural celebrations. Features intricate embroidery and a comfortable fit.",
  },
  {
    id: 2,
    name: "Ankara Shirt & Trousers",
    category: "male",
    subCategory: "ankara",
    ageGroup: "adult",
    price: 80,
    image: "/images/ankara shirt and trousers men.jpg",
    hoverImage: "/images/ankara shirt and trousers men.jpg",
    description:
      "Vibrant Ankara shirt and trousers set made from authentic African print fabric. Combines traditional patterns with modern styling for a bold, fashionable look.",
  },
  {
    id: 3,
    name: "Owanbe Classical Gown",
    category: "female",
    subCategory: "owanbe",
    ageGroup: "adult",
    price: 20,
    isFeatured: true,
    image: "/images/Owambe gown.png",
    hoverImage: "/images/Owambe gown.png",
    description:
      "Stunning Owanbe gown designed for celebrations and special events. Features luxurious fabric with elegant detailing that ensures you stand out at any gathering.",
  },
  {
    id: 4,
    name: "Corset Dress",
    category: "female",
    subCategory: "corset",
    ageGroup: "adult",
    price: 80,
    isNew: true,
    image: "/images/corset dress.jpg",
    hoverImage: "/images/corset dress.jpg",
    description:
      "Sophisticated corset dress that accentuates your figure with its structured design. Perfect blend of traditional craftsmanship with contemporary fashion sensibilities.",
  },
  {
    id: 5,
    name: "Children's Ankara Set",
    category: "male",
    subCategory: "ankara",
    ageGroup: "children",
    price: 20,
    image: "/images/male children ankara set.jpg",
    hoverImage: "/images/male children ankara set.jpg",
    description:
      "Colorful Ankara set designed specifically for children. Made with soft, comfortable fabric featuring playful patterns that kids will love wearing for special occasions.",
  },
  {
    id: 6,
    name: "Baby Kaftan",
    category: "male",
    subCategory: "senator",
    ageGroup: "baby",
    price: 90,
    image: "/images/male portrait.jpeg",
    hoverImage: "/images/male portrait.jpeg",
    description:
      "Adorable baby kaftan made from gentle, skin-friendly fabric. Perfect for celebrations and family gatherings, ensuring your little one looks stylish while staying comfortable.",
  },
  {
    id: 7,
    name: "Elegant Iro and Buba",
    category: "female",
    subCategory: "iro",
    ageGroup: "adult",
    price: 20,
    isFeatured: true,
    image: "/images/iro and buba.jpg",
    hoverImage: "/images/iro and buba.jpg",
    description:
      "Traditional Iro and Buba ensemble crafted with attention to detail. Features classic styling with modern touches, perfect for cultural celebrations and formal events.",
  },
  {
    id: 8,
    name: "Corporate Shirt & Trousers",
    category: "male",
    subCategory: "corporate",
    ageGroup: "adult",
    price: 90,
    image: "/images/male portrait.jpeg",
    hoverImage: "/images/male portrait.jpeg",
    description:
      "Professional corporate attire tailored for the modern workplace. Combines sharp styling with comfortable fit, ensuring you look polished and feel confident throughout your day.",
  },

  // ...more products
];
