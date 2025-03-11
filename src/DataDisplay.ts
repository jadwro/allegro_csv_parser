import { DataTableType } from "./types/DataTableType";

export class DataDisplay {
  #totalNetValue: number = 0;
  #totalVatValue: number = 0;
  #totalGrossValue: number = 0;

  buildTable(dataTableElement: HTMLTableElement, data: DataTableType[]) {
    dataTableElement.innerHTML = '';
    
    if (data.length === 0) return;
  
    const headers = Object.keys(data[0]);
    const headerRow = dataTableElement.insertRow();

    const lpHeader = document.createElement('th');
    lpHeader.style.fontWeight = 'bold';
    lpHeader.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-100');
    lpHeader.textContent = "Lp.";
    headerRow.appendChild(lpHeader);

    headers.forEach(header => {
      const th = document.createElement('th');
      th.style.fontWeight = 'bold';
      th.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-100');
      th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
      headerRow.appendChild(th);
    }); 
    
    data.forEach((row, i) => {
      const dataRow = dataTableElement.insertRow();

      const lpCell = dataRow.insertCell();
      lpCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2');
      lpCell.textContent = (i + 1).toString();

      headers.forEach(header => {
        const cell = dataRow.insertCell();
        cell.classList.add('border', 'border-gray-300', 'px-4', 'py-2');
        cell.textContent = row[header as keyof DataTableType] || '';
      });
      this.calculateTotal(row['netValue'], row['vatAmount'], row['grossValue']);
    });

    const totalRow = dataTableElement.insertRow();

    const totalCell = totalRow.insertCell();
    totalCell.colSpan = 6;
    totalCell.style.fontWeight = 'bold';
    totalCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-center');
    totalCell.textContent = 'Total:';
  
    const totalNet = totalRow.insertCell();
    totalNet.style.fontWeight = 'bold';
    totalNet.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-center');
    totalNet.textContent = this.#totalNetValue.toFixed(2);
    const totalVat = totalRow.insertCell();
    totalVat.style.fontWeight = 'bold';
    totalVat.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-center');
    totalVat.textContent = this.#totalVatValue.toFixed(2);
    const totalGross = totalRow.insertCell();
    totalGross.style.fontWeight = 'bold';
    totalGross.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-center');
    totalGross.textContent = this.#totalGrossValue.toFixed(2);
  
    const emptyCell = totalRow.insertCell();
    emptyCell.colSpan = 3;
    emptyCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2');
    emptyCell.textContent = '';
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

  private calculateTotal(net: string, vat: string, gross: string) {
    this.#totalNetValue += +net.replace(',','.');
    this.#totalVatValue += +vat.replace(',','.');
    this.#totalGrossValue += +gross.replace(',','.');
  }
}