// OrderCSVHandler3.ts
import Papa from "papaparse";
import { OrderType } from "../types/OrderType";
import { ShopifyHeaderMap, ShopifyOrderTypeCSV } from "./types/ShopifyOrderTypeCSV";
import { ProductType } from "../types/ProductType";

export default class ShopifyOrdersCSVHandler {
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
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          return ShopifyHeaderMap[header] || header;
        },
        complete: (results: any) => {
          const data = results.data as ShopifyOrderTypeCSV[];
          const parsedOrders = data
            .map(this.mapOrdersCSV.bind(this))
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
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          return ShopifyHeaderMap[header] || header;
        },
        complete: (results: any) => {
          const data = results.data as ShopifyOrderTypeCSV[];
          const parsedProducts = data
            .map(this.mapProductsCSV.bind(this))
            .filter(Boolean) as ProductType[];
          resolve(parsedProducts);
        },
        error: (error: any) => reject(error),
      });
    });
  }

  private mapOrdersCSV(data: ShopifyOrderTypeCSV): OrderType | null {
    if (this.shouldNotBeProceeded(data)) {
      return null;
    }

    return {
      orderId: data.Name,
      orderDate: data.CreatedAt,
      buyerData: {
        buyerName: `${data.BillingName}`.trim(),
        buyerAddress: {
          buyerStreet: data.BillingAddress1,
          buyerZip: data.BillingZip,
          buyerCity: data.BillingCity,
          buyerCountry: ""
        }
      },
      paymentData: {
        paymentId: data.PaymentID,
        paymentAmount: parseFloat(data.Total) || 0,
        paymentCurrency: "PLN"
      },
      invoiceIssued: false, // TODO?
      shippingCost: data.Shipping
    };
  }

  private mapProductsCSV(data: ShopifyOrderTypeCSV): ProductType | null {
    if (this.shouldNotBeProceeded(data)) {
      return null;
    }

    return {
      orderId: data.Name,
      productName: data.LineitemName,
      quantity: +data.LineitemQuantity,
      price: +data.LineitemPrice,
      returnsQuantity: 0
    }
  }

  private shouldNotBeProceeded(data: ShopifyOrderTypeCSV) {
    return data.FulfillmentStatus.toLowerCase() === "unfulfilled" 
      || data.FinancialStatus.toLowerCase() === "voided"
      || data.FinancialStatus.toLowerCase() === "refunded";
  }
}
