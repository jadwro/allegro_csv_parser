export type OrderType = {
  orderId: string,
  orderDate: Date,
  buyerData: BuyerData,
  paymentData: PaymentData,
  invoiceIssued: boolean
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