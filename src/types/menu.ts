export type MenuGroup = 'Food' | 'Drinks'

export type DataStatus = 'verified' | 'needs-review' | 'mock'

export type MenuCategory = {
  id: string
  name: string
  description: string
  group: MenuGroup
  note?: string
}

export type MenuPrice = {
  amount: number
  currency: 'UGX'
  label?: string
}

export type MenuItem = {
  id: string
  name: string
  categoryId: string
  sourceSection: string

  nameStatus?: DataStatus

  description?: string
  descriptionStatus?: DataStatus

  price?: MenuPrice
  priceOptions?: MenuPrice[]
  priceStatus?: DataStatus

  image?: string
  featured?: boolean
}
