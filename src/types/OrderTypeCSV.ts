import { OrderStatus } from "./OrderStatus";

export type OrderTypeCSV = {
  Type: string;
  OrderId: string;
  OrderDate: string;
  SellerStatus: OrderStatus;
  BuyerId: string;
  BuyerLogin: string;
  BuyerEmail: string;
  BuyerCompany: string;
  BuyerName: string;
  BuyerPhone: string;
  BuyerAddress: string;
  BuyerZip: string;
  BuyerCity: string;
  BuyerCountryCode: string;
  PaymentId: string;
  PaymentProvider: string;
  AllegroPay: string;
  PaymentAmount: string;
  PaymentCurrency: string;
  TotalToPayAmount: string;
  InvoiceTaxId: string;
};