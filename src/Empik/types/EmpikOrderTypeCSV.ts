export type EmpikOrderTypeCSV = {
  OrderDate: string;
  OrderId: string;
  Quantity: string;
  ProductName: string;
  Status: string;
  Amount: string;
  UnitPrice: string;
  ShippingPrice: string;
  TotalShippingAmount: string;
  TotalOrderAmountWithoutTax: string;
  TotalOrderAmountWithVAT: string;
  AmountTransferredToShop: string;
  TotalRefundedAmount: string;
  BuyerFirstName: string;
  BuyerLastName: string;
  BuyerStreet: string;
  BuyerZip: string;
  BuyerCity: string;
  BuyerTaxNumber: string;
};

export const EmpikHeaderMap: Record<string, string> = {
  "Data utworzenia": "OrderDate",
  "Nr zamówienia": "OrderId",
  "Ilość": "Quantity",
  "Szczegóły": "ProductName",
  "Status": "Status",
  "Kwota": "Amount",
  "Cena jednostkowa": "UnitPrice",
  "Cena wysyłki": "ShippingPrice",
  "Łączna kwota za wysyłkę": "TotalShippingAmount",
  "Całkowita kwota zamówienia bez podatków (w tym koszty wysyłki)": "TotalOrderAmountWithoutTax",
  "Łączna kwota za zamówienie z podatkiem VAT (z opłatami za wysyłkę)": "TotalOrderAmountWithVAT",
  "Kwota przelana na konto sklep (z podatkiem)": "AmountTransferredToShop",
  "Całkowita zwrócona kwota (w tym podatki)": "TotalRefundedAmount",
  "Adres do faktury: imię": "BuyerFirstName",
  "Adres do faktury: nazwisko": "BuyerLastName",
  "Adres do faktury: ulica 1": "BuyerStreet",
  "Adres do faktury: kod pocztowy": "BuyerZip",
  "Adres do faktury: miejscowość": "BuyerCity",
  "NIP klienta": "BuyerTaxNumber"
};
