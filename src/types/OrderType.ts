export type OrderType = {
  orderId: string,
  orderDate: string,
  buyerData: BuyerData,
  paymentData: PaymentData,
  invoiceIssued: boolean,
  shippingCost?: string
}

type BuyerData = {
  buyerName: string,
    buyerAddress: {
      buyerStreet: string,
      buyerZip: string,
      buyerCity: string,
      buyerCountry: string
    }
}

type PaymentData = {
  paymentId: string,
  paymentAmount: number,
  paymentCurrency: string
}