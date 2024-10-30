import Papa from "papaparse";
import { OrderStatus } from "./types/OrderStatus";
import { OrderType } from "./types/OrderType";
import { OrderTypeCSV } from "./types/OrderTypeCSV";

export default class OrderCSVHandler {
  private orders: OrderType[] = [];

  getOrders() {
    return this.orders ?? (() => { throw Error("NO ORDERS FOUND"); })();
  }

  async parseOrderCSV(data: string) {
    this.orders = await new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data as OrderTypeCSV[];
          
          const parsedOrders = data.map(this.mapOrderCSV).filter(Boolean) as OrderType[];
          console.log(parsedOrders)
          resolve(parsedOrders);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapOrderCSV(data: OrderTypeCSV): OrderType | null {
    if(data.SellerStatus === OrderStatus.CANCELLED) {
      return null;
    }
    
    return {
      orderId: data.OrderId,
      orderDate: new Date(data.OrderDate),
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
        paymentCurrency: data.PaymentCurrency
      },
      invoiceIssued: data.InvoiceTaxId !== ''
    }  
  }
}