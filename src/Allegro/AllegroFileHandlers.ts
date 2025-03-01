import AllegroOrderCSVHandler from "./AllegroOrderCSVHandler";
import AllegroProductCSVHandler from "./AllegroProductCSVHandler";
import { ParsedData } from "../types/ParsedData";

export class AllegroFileHandler {
  constructor(private fileContent: string) {}

  async processFile(): Promise<ParsedData> {
    const tables = this.fileContent.split(/\n\s*\n/);
    const ordersTable = tables[0];
    const productsTable = tables[1];

    const ordersHandler = new AllegroOrderCSVHandler();    
    const orders = (await ordersHandler.parseOrderCSV(ordersTable));

    const productsHandler = new AllegroProductCSVHandler();
    const products = await productsHandler.parseProductCSV(productsTable); 
    
    return {
      orders: orders,
      products: products
    }
  }
}