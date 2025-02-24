import axios from 'axios';
import { OrderType } from './types/OrderType';
import { ProductType } from './types/ProductType';

export default class CurrencyHandler {
  async calculateOrderPrice(order: OrderType): Promise<OrderType> {
    if(order.paymentData.paymentCurrency !== '' && order.paymentData.paymentCurrency !== 'PLN') {
      const exchangeRate = await this.getExchangeRate(order.paymentData.paymentCurrency, order.orderDate);
      order.paymentData.paymentAmount *= exchangeRate;
    }

    return order;
  }

  async calculateProductPrice(product: ProductType, order: OrderType): Promise<ProductType> {
    if(product.currency !== '' && product.currency !== 'PLN') {
      if(product.currency === undefined) throw Error(`Product ${product.productName} currency is undefined!`);

      const exchangeRate = await this.getExchangeRate(product.currency, order.orderDate);
      product.price *= exchangeRate;
    }

    return product;
  }

  private async getExchangeRate(currency: string, date: string): Promise<number> {
    let attempts = 0;
    let currentDate = new Date(date);
  
    while (attempts < 5) {
      const formattedDate = this.convertDateFormat(currentDate.toISOString());
      try {
        const response = await axios.get(
          `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/${formattedDate}/`,
          { 
            headers: { Accept: "application/json" },
          }
        );
        return response.data.rates[0].mid as number;
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        attempts++;
        if (attempts < 5) {
          currentDate.setDate(currentDate.getDate() - 1);
          } else {
            throw new Error(`No data for ${currency} in last 5 days`);
          }
        } else {
          throw new Error(`Error fetching data (currency: ${currency}, date: ${formattedDate}) from NBP: ${e}`);
        }
      }
    }
    throw new Error(`No data for ${currency} in last 5 days`);
  }
  
  private convertDateFormat(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // miesiące zaczynają się od 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}