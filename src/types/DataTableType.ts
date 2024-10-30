import { SalePlatform } from "./SalePlatform"

export type DataTableType = {
  id: string,
  date: string,
  products: string,
  buyerData: string,
  shippingCost: string,
  netValue: string,
  vatAmount: string,
  grossValue: string,
  vatRate: string,
  transactionId: string,
  platform: SalePlatform
}