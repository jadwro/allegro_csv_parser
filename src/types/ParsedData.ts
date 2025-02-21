import { OrderType } from "./OrderType";
import { ProductType } from "./ProductType";

export type ParsedData = {
  orders: OrderType[];
  products: ProductType[];
} | undefined;