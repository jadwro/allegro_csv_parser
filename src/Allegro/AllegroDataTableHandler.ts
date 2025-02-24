import { OrderType } from "../types/OrderType";
import { ProductType } from "../types/ProductType";
import { DataTableType } from '../types/DataTableType';
import { VAT_RATE } from "../Consts";
import { SalePlatform } from "../types/SalePlatform";
import CurrencyHandler from "../CurrencyHandler";

export class AllegroDataTableHandler {  
  private dataTable: DataTableType[] = [];
  
  constructor(private suffix: string, private orders: OrderType[], private products: ProductType[]) {
    this.orders = orders;
    this.products = products;
  }

  getData() {
    return this.dataTable;
  }

  async matchItemsWithOrders() {
    const currencyHandler = new CurrencyHandler();
    this.orders = await Promise.all(
  this.orders.map(order => currencyHandler.calculateOrderPrice(order))
    );

    return await Promise.all(this.orders
      .filter(order => !order.invoiceIssued)
      .reverse()
      .map(async (order, index) => {        
        const productsBeforeReturns = await Promise.all(
          this.products.filter(product => product.orderId === order.orderId)
            .map(product => currencyHandler.calculateProductPrice(product, order))
        );
        const shippingCost = this.calculateShipping(order, productsBeforeReturns);

        const productsAfterReturns = this.handleReturns(productsBeforeReturns.map(product => ({ ...product })));
        const amounts = this.calculatePrice(productsAfterReturns, shippingCost);
        
        return {
          id: this.generateId(index+1),
          date: this.formatDate(order.orderDate),
          products: this.createProductsList(productsAfterReturns.map(product => ({ ...product }))),
          buyerData: this.formatBuyerData(order),
          shippingCost: shippingCost.toString().replace('.',','),
          netValue: amounts.netAmount.toString().replace('.',','),
          vatAmount: amounts.vatAmount.toString().replace('.',','),
          grossValue: amounts.grossAmount.toString().replace('.',','),
          vatRate: VAT_RATE.toString().replace('.',','),
          transactionId: order.paymentData.paymentId,
          platform: SalePlatform.ALLEGRO
        }
    }));
  }

  private formatDate(stringDate: string): string {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }
  

  private generateId(index: number) {
    return `${index}_al/${this.suffix}`;
  }

  private handleReturns(products: ProductType[]) {
    const result = products.map(product => {
      if(product.returnsQuantity === 0) {
        return product;
      }

      const newPrice = product.quantity*product.price - product.returnsQuantity*product.price;
      const newQuantity = product.quantity - product.returnsQuantity;
      product.price = newPrice;
      product.quantity = newQuantity;

      return product;
    }).filter((product): product is ProductType => product !== null);

    return result;
  }

  private createProductsList(products: ProductType[]) {
    const returns = products.filter(product => product.returnsQuantity > 0);
    
    let productList = products
      .filter(product => product.quantity > 0)
      .map(product => `${product.productName} (${product.quantity} szt.)`)
      .join(', ');

    const returnsText = productList.length > 0 ? '; zwroty:' : 'Zwroty:';

    if(returns.length > 0) {
      const returnsList = returns
        .map(product => `${product.productName} (${product.returnsQuantity} szt.)`)
        .join(', ');

      productList += `${returnsText} ${returnsList}`;
    }

    return productList;
  }
  
  private formatBuyerData(order: OrderType) {
    const country = order.buyerData.buyerAddress.buyerCountry === 'PL' ? '' : `, ${order.buyerData.buyerAddress.buyerCountry}`;
    return `${order.buyerData.buyerName}, ${order.buyerData.buyerAddress.buyerStreet}, ${order.buyerData.buyerAddress.buyerZip} ${order.buyerData.buyerAddress.buyerCity}${country}`;
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