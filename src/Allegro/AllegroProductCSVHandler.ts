import Papa from "papaparse";
import { AllegroProductTypeCSV } from './types/AllegroProductTypeCSV';
import { ProductType } from '../types/ProductType';

export default class AllegroProductCSVHandler {
  async parseProductCSV(data: string): Promise<ProductType[]> {
    return await new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data as AllegroProductTypeCSV[];
          
          const parsedProducts = data.map(this.mapProductCSV).filter(Boolean) as ProductType[];

          resolve(parsedProducts);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapProductCSV(data: AllegroProductTypeCSV): ProductType | null {    
    return {
      orderId: data.OrderId,
      productName: data.Name,
      quantity: +data.Quantity,
      price: +data.Price,
      returnsQuantity: +data.ReturnsQuantity,
      currency: data.Currency
    }
  }
}