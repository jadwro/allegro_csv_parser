import { DataTable } from "./DataTable";
import { DataTableHandler } from "./DataTableHandler";
import { OrderType } from "./types/OrderType";
import { ProductType } from "./types/ProductType";

export class DataDisplay {
  displayTable(tableElement: HTMLTableElement, orders: OrderType[], products: ProductType[]) {
    const data = new DataTableHandler(orders, products);
    data.matchItemsWithOrders();
    
    const dataTable = new DataTable(data.getData());
    dataTable.buildTable(tableElement);
  }

  copyContent(tableElement: HTMLTableElement) {
    let tableText = '';

    Array.from(tableElement.rows).forEach(row => {
      Array.from(row.cells).forEach(cell => {
        tableText += cell.innerText + '\t';
      });
      tableText += '\n';
    });

    navigator.clipboard.writeText(tableText)
      .then(() => alert('Zawartość tabeli skopiowana.'))
      .catch(err => console.error('Error: ', err));
  };

  showCopyButton(buttonElement: HTMLButtonElement) {
    buttonElement.style.display = 'inline-block';
  }
}