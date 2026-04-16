export interface Listing {
  id: string
  title: string
  price: number
  currency: string
  category: string
  seller: string
  location: string
  image: string
  condition: string
  liked: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  count: number
  icon: string
}

export const categories: Category[] = [
  { id: 'clothing',   name: 'Clothing',      description: 'Vintage & designer fashion',    count: 12450, icon: 'Shirt' },
  { id: 'jewelry',    name: 'Jewelry',        description: 'Unique pieces with character',   count: 8320,  icon: 'Gem' },
  { id: 'watches',    name: 'Watches',        description: 'Timeless classics',              count: 3890,  icon: 'Watch' },
  { id: 'bags',       name: 'Purses & Bags',  description: 'Designer & vintage bags',        count: 6720,  icon: 'ShoppingBag' },
  { id: 'crockery',   name: 'Crockery',       description: 'Elegant tableware',              count: 4150,  icon: 'UtensilsCrossed' },
]

export const featuredListings: Listing[] = [
  {
    id: '1',
    title: "Vintage Levi's Denim Jacket",
    price: 310,
    currency: 'Dhs',
    category: 'Clothing',
    seller: 'VintageVibes',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80&fit=crop',
    condition: 'Good',
    liked: false,
  },
  {
    id: '2',
    title: 'Art Deco Pearl Necklace',
    price: 900,
    currency: 'Dhs',
    category: 'Jewelry',
    seller: 'JewelBox',
    location: 'Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&fit=crop',
    condition: 'Excellent',
    liked: false,
  },
  {
    id: '3',
    title: 'Classic Omega Seamaster',
    price: 4400,
    currency: 'Dhs',
    category: 'Watches',
    seller: 'TimePiece',
    location: 'Sharjah, UAE',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80&fit=crop',
    condition: 'Very Good',
    liked: false,
  },
  {
    id: '4',
    title: 'Hermès Silk Scarf',
    price: 1200,
    currency: 'Dhs',
    category: 'Clothing',
    seller: 'LuxeResale',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1558171813-1a5d1f28e07b?w=600&q=80&fit=crop',
    condition: 'Excellent',
    liked: false,
  },
  {
    id: '5',
    title: 'Chanel Classic Flap Bag',
    price: 18500,
    currency: 'Dhs',
    category: 'Purses & Bags',
    seller: 'AuthenticLux',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&fit=crop',
    condition: 'Good',
    liked: false,
  },
  {
    id: '6',
    title: 'Vintage Wedgwood Tea Set',
    price: 750,
    currency: 'Dhs',
    category: 'Crockery',
    seller: 'VintageCrockery',
    location: 'Ajman, UAE',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&fit=crop',
    condition: 'Good',
    liked: false,
  },
]

export const allListings: Listing[] = [
  ...featuredListings,
  {
    id: '7',
    title: 'Louis Vuitton Speedy 30',
    price: 3200,
    currency: 'Dhs',
    category: 'Purses & Bags',
    seller: 'BagLover',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&fit=crop',
    condition: 'Very Good',
    liked: false,
  },
  {
    id: '8',
    title: 'Rolex Submariner',
    price: 38000,
    currency: 'Dhs',
    category: 'Watches',
    seller: 'WatchWorld',
    location: 'Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80&fit=crop',
    condition: 'Excellent',
    liked: false,
  },
  {
    id: '9',
    title: 'Vintage Gucci Loafers',
    price: 1800,
    currency: 'Dhs',
    category: 'Clothing',
    seller: 'FashionBack',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop',
    condition: 'Good',
    liked: false,
  },
]
