import Papa from "papaparse";
import { ProductTypeCSV } from './types/ProductTypeCSV';
import { ProductType } from './types/ProductType';

export default class ProductCSVHandler {
  private products: ProductType[] = [];

  getProducts() {
    return this.products ?? (() => { throw Error("NO PRODUCTS FOUND"); })();
  }
  
  async parseProductCSV(data: string) {
    this.products = await new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data as ProductTypeCSV[];
          
          const parsedProducts = data.map(this.mapProductCSV).filter(Boolean) as ProductType[];

          resolve(parsedProducts);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapProductCSV(data: ProductTypeCSV): ProductType | null {    
    return {
      orderId: data.OrderId,
      productName: data.Name,
      quantity: +data.Quantity,
      price: +data.Price,
      returnsQuantity: +data.ReturnsQuantity
    }
  }
}