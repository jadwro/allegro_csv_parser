import { ParsedData } from "../types/ParsedData";
import EmpikOrdersCSVHandler from './EmpikOrdersCSVHandler'

export class EmpikFileHandler {
  constructor(private fileContent: string) {}

  async processFile(): Promise<ParsedData> {
    const ordersHandler = new EmpikOrdersCSVHandler();
    await ordersHandler.parseOrdersCSV(this.fileContent);
    await ordersHandler.parseProductsCSV(this.fileContent);

    return {
      orders: ordersHandler.getOrders(),
      products: ordersHandler.getProducts()
    }
  }
}