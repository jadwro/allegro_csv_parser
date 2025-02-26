import { OrderType } from "../types/OrderType";
import { ProductType } from "../types/ProductType";
import { DataTableType } from '../types/DataTableType';
import { VAT_RATE } from "../Consts";
import { SalePlatform } from "../types/SalePlatform";

export class ShopifyDataTableHandler {  
  private dataTable: DataTableType[] = [];
  
  constructor(private suffix: string, private orders: OrderType[], private products: ProductType[]) {
    this.orders = orders;
    this.products = products;
  }

  getData() {
    return this.dataTable;
  }

  matchItemsWithOrders() {
    return this.orders
      .filter((order, index, self) => index === self.findIndex(o => o.orderId === order.orderId))
      .filter(order => order.paymentData.paymentAmount !== 0)
      .reverse()
      .map((order, index) => {        
        const products = this.products.filter(product => product.orderId === order.orderId);
        const shippingCost = this.calculateShipping(order, products);

        const amounts = this.calculatePrice(products, shippingCost);
        
        return {
          id: this.generateId(index+1),
          date: this.formatDate(order.orderDate),
          products: this.createProductsList(products.map(product => ({ ...product }))),
          buyerData: this.formatBuyerData(order),
          shippingCost: order.shippingCost!.replace('.',','),
          netValue: amounts.netAmount.toString().replace('.',','),
          vatAmount: amounts.vatAmount.toString().replace('.',','),
          grossValue: amounts.grossAmount.toString().replace('.',','),
          vatRate: VAT_RATE.toString().replace('.',','),
          transactionId: order.paymentData.paymentId,
          platform: SalePlatform.SHOPIFY
        }
    });
  }

  // private formatDate(stringDate: string): string {
  //   return stringDate.slice(0, 10);
  // }
  
  private formatDate(stringDate: string): string {
    const result = stringDate.slice(0, 10).split('-');
    const [year, month, day] = result;
    return `${day}.${month}.${year}`;
  }

  private generateId(index: number) {
    return `${index}_sh/${this.suffix}`;
  }

  private createProductsList(products: ProductType[]) {
    let productList = products
      .filter(product => product.quantity > 0)
      .map(product => {
        const productName = product.productName.replace(/\(SKU.*?oferty\s*:\s*[^)]+\)/g, '').trim();
        return `${productName} (${product.quantity} szt.)`;
      })
      .join(', ');

    return productList;
  }
  
  private formatBuyerData(order: OrderType) {
    return `${order.buyerData.buyerName}, ${order.buyerData.buyerAddress.buyerStreet}, ${order.buyerData.buyerAddress.buyerZip} ${order.buyerData.buyerAddress.buyerCity}`;
  }

  private calculateShipping(order: OrderType, products: ProductType[]) {
    const productsTotalPrice = this.sumProductsPrice(products);
    return +(order.paymentData.paymentAmount - productsTotalPrice).toFixed(2);
  }

  private calculatePrice(products: ProductType[], shippingCost: number) {
    const grossAmount = this.sumProductsPrice(products) + shippingCost;
    const netAmount = +(grossAmount / VAT_RATE).toFixed(2);
    const vatAmount = +(grossAmount - netAmount).toFixed(2);
    
    return {
      grossAmount: grossAmount.toFixed(2),
      netAmount: netAmount,
      vatAmount: vatAmount
    }
  }

  private sumProductsPrice(products: ProductType[]) {
    return products.reduce((accumulator, product) => accumulator + product.quantity * product.price, 0);
  }
}