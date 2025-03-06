// OrderCSVHandler3.ts
import Papa from "papaparse";
import { OrderType } from "../types/OrderType";
import { EmpikHeaderMap, EmpikOrderTypeCSV } from "./types/EmpikOrderTypeCSV";
import { ProductType } from "../types/ProductType";

export default class EmpikOrdersCSVHandler {
  private orders: OrderType[] = [];
  private products: ProductType[] = [];

  getOrders(): OrderType[] {
    if (!this.orders) {
      throw Error("NO ORDERS FOUND");
    }
    return this.orders;
  }

  getProducts(): ProductType[] {
    if (!this.products) {
      throw Error("NO PRODUCTS FOUND");
    }
    return this.products;
  }

  async parseOrdersCSV(data: string) {
    this.orders = await new Promise((resolve, reject) => {
      Papa.parse(data, {
        delimiter: ';',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          return EmpikHeaderMap[header] || header;
        },
        complete: (results: any) => {
          const data = results.data as EmpikOrderTypeCSV[];
          const parsedOrders = data
            .map(this.mapOrdersCSV)
            .filter(Boolean) as OrderType[];
          resolve(parsedOrders);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  async parseProductsCSV(data: string) {
    this.products = await new Promise((resolve, reject) => {
      Papa.parse(data, {
        delimiter: ';',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          return EmpikHeaderMap[header] || header;
        },
        complete: (results: any) => {
          const data = results.data as EmpikOrderTypeCSV[];
          const parsedProducts = data
            .map(this.mapProductsCSV)
            .filter(Boolean) as ProductType[];
          resolve(parsedProducts);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapOrdersCSV(data: EmpikOrderTypeCSV): OrderType | null {
    if (data.Status.toLowerCase() === "anulowane") {
      return null;
    }
    return {
      orderId: data.OrderId,
      orderDate: data.OrderDate,
      buyerData: {
        buyerName: `${data.BuyerFirstName} ${data.BuyerLastName}`.trim(),
        buyerAddress: {
          buyerStreet: data.BuyerStreet,
          buyerZip: data.BuyerZip,
          buyerCity: data.BuyerCity,
          buyerCountry: ""
        }
      },
      paymentData: {
        paymentId: data.OrderId,
        paymentAmount: parseFloat(data.TotalOrderAmountWithoutTax) || 0,
        paymentCurrency: "PLN"
      },
      invoiceIssued: data.BuyerTaxNumber !== '', // TODO?
      shippingCost: data.TotalShippingAmount
    };
  }

  private mapProductsCSV(data: EmpikOrderTypeCSV): ProductType | null {
    if (data.Status.toLowerCase() === "anulowane") {
      return null;
    }
    return {
      orderId: data.OrderId,
      productName: data.ProductName,
      quantity: +data.Quantity,
      price: +data.TotalOrderAmountWithVAT,
      returnsQuantity: 0 // TODO?
    }
  }
}
