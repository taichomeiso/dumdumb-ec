export type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  isNew: boolean;
  category: string;
};

export type Favorite = {
  id: string;
  productId: string;
  userId: string;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
};