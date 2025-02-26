import { ParsedData } from "../types/ParsedData";
import ShopifyOrdersCSVHandler from './ShopifyOrdersCSVHandler'

export class ShopifyFileHandler {
  constructor(private fileContent: string) {}

  async processFile(): Promise<ParsedData> {
    const ordersHandler = new ShopifyOrdersCSVHandler();
    await ordersHandler.parseOrdersCSV(this.fileContent);
    await ordersHandler.parseProductsCSV(this.fileContent);

    return {
      orders: ordersHandler.getOrders(),
      products: ordersHandler.getProducts()
    }
  }
}