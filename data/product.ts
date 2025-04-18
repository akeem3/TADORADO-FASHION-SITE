// data/products.ts

export type Product = {
    id: number
    name: string
    category: string
    subCategory: string
    ageGroup: string
    price: number
    salePrice?: number
    image: string
    hoverImage?: string
    isNew?: boolean
    isFeatured?: boolean
  }
  
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
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/agbada.jpg?alt=media&token=fb644790-6e97-4820-b75c-088cb559223e",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/agbada.jpg?alt=media&token=fb644790-6e97-4820-b75c-088cb559223e",
    },
    {
      id: 2,
      name: "Ankara Shirt & Trousers",
      category: "male",
      subCategory: "ankara",
      ageGroup: "adult",
      price: 80,
      salePrice: 50,
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/ankara%20shirt%20and%20trousers%20men.jpg?alt=media&token=e1af5267-98de-468c-8f82-a0c6fabaeb3d",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/ankara%20shirt%20and%20trousers%20men.jpg?alt=media&token=e1af5267-98de-468c-8f82-a0c6fabaeb3d",
    },
    {
      id: 3,
      name: "Owanbe Classical Gown",
      category: "female",
      subCategory: "owanbe",
      ageGroup: "adult",
      price: 20,
      isFeatured: true,
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Owambe%20gown.png?alt=media&token=c141d5fc-caaa-46c2-b733-5f15bc30bf93",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Owambe%20gown.png?alt=media&token=c141d5fc-caaa-46c2-b733-5f15bc30bf93",
    },
    {
      id: 4,
      name: "Corset Dress",
      category: "female",
      subCategory: "corset",
      ageGroup: "adult",
      price: 80,
      isNew: true,
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/corset%20dress.jpg?alt=media&token=824940a7-4951-4ddc-ab6e-57119a830b18",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/corset%20dress.jpg?alt=media&token=824940a7-4951-4ddc-ab6e-57119a830b18",
    },
    {
      id: 5,
      name: "Children's Ankara Set",
      category: "male",
      subCategory: "ankara",
      ageGroup: "children",
      price: 20,
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/male%20children%20ankara%20set.jpg?alt=media&token=2d3c4f81-d1ba-4458-92d2-2963c573cf87",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/male%20children%20ankara%20set.jpg?alt=media&token=2d3c4f81-d1ba-4458-92d2-2963c573cf87",
    },
    {
      id: 6,
      name: "Baby Kaftan",
      category: "male",
      subCategory: "senator",
      ageGroup: "baby",
      price: 90,
      salePrice: 75,
      image: "/placeholder.svg?height=400&width=300",
      hoverImage: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 7,
      name: "Elegant Iro and Buba",
      category: "female",
      subCategory: "iro",
      ageGroup: "adult",
      price: 20,
      isFeatured: true,
      image:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/iro%20and%20buba.jpg?alt=media&token=0565a811-03e8-4d42-8d2f-55dd6c5c59f8",
      hoverImage:
        "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/iro%20and%20buba.jpg?alt=media&token=0565a811-03e8-4d42-8d2f-55dd6c5c59f8",
    },
    {
      id: 8,
      name: "Corporate Shirt & Trousers",
      category: "male",
      subCategory: "corporate",
      ageGroup: "adult",
      price: 90,
      image: "/placeholder.svg?height=400&width=300",
      hoverImage: "/placeholder.svg?height=400&width=300",
    },

    
    // ...more products
  ]
  