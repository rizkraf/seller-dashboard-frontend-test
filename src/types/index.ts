export interface Category {
  id: number
  name: string
  slug: string
  image: string
}

export interface Product {
  id: number
  title: string
  slug: string
  price: number
  description: string
  category: Category
  images: string[]
  creationAt: string
  updatedAt: string
}

export interface FilterValues {
  title: string
  price_min: string
  price_max: string
  categoryId: number | null
}
