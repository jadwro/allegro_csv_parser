import Papa from "papaparse";
import { AllegroOrderStatus } from "./types/AllegroOrderStatus";
import { OrderType } from "../types/OrderType";
import { AllegroOrderTypeCSV } from "./types/AllegroOrderTypeCSV";

export default class AllegroOrderCSVHandler {
  async parseOrderCSV(data: string): Promise<OrderType[]> {
    return await new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data as AllegroOrderTypeCSV[];
          
          const parsedOrders = data.map(this.mapOrderCSV).filter(Boolean) as OrderType[];
          resolve(parsedOrders);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapOrderCSV(data: AllegroOrderTypeCSV): OrderType | null {
    if(data.SellerStatus === AllegroOrderStatus.CANCELLED) {
      return null;
    }
    
    return {
      orderId: data.OrderId,
      orderDate: data.OrderDate,
      buyerData: {
        buyerName: data.BuyerName,
        buyerAddress: {
          buyerStreet: data.BuyerAddress,
          buyerZip: data.BuyerZip,
          buyerCity: data.BuyerCity,
          buyerCountry: data.BuyerCountryCode
        }      
      },
      paymentData: {
        paymentId: data.PaymentId,
        paymentAmount: +data.TotalToPayAmount,
        paymentCurrency: data.TotalToPayCurrency
      },
      invoiceIssued: data.InvoiceTaxId !== ''
    }  
  }
}