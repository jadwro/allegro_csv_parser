import OrderCSVHandler from "./OrderCSVHandler";
import ProductCSVHandler from "./ProductCSVHandler";
import { OrderType } from "./types/OrderType";
import { ProductType } from "./types/ProductType";

export class FileHandler {
  private parsedData: {
    orders: OrderType[];
    products: ProductType[];
  } | undefined;

  constructor(private file: File) {
    this.file = file;
  }

  getParsedData() {
    if(this.parsedData === undefined) {
      throw new Error('Orders or products are undefined!');
    }
    return this.parsedData;
  }

  async uploadAndProcessFile() {
    const fileContent = await this.file.text();
    const tables = fileContent.split(/\n\s*\n/);
    const ordersTable = tables[0];
    const productsTable = tables[1];

    const ordersHandler = new OrderCSVHandler();    
    await ordersHandler.parseOrderCSV(ordersTable);

    const productsHandler = new ProductCSVHandler();
    await productsHandler.parseProductCSV(productsTable); 
    
    this.parsedData = {
      orders: ordersHandler.getOrders(),
      products: productsHandler.getProducts()
    }
  }
}