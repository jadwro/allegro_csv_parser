import { AllegroOrderStatus } from "./AllegroOrderStatus";

export type AllegroOrderTypeCSV = {
  Type: string;
  OrderId: string;
  OrderDate: string;
  SellerStatus: AllegroOrderStatus;
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
  Marketplace: string;
  TotalToPayCurrency: string;
};