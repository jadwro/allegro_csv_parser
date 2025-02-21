import { DataTableType } from "./types/DataTableType";

export class DataTable {
  constructor(private data: DataTableType[]) {
    this.data = data;
  }

  buildTable(dataTableElement: HTMLTableElement) {
    dataTableElement.innerHTML = '';
    
    if (this.data.length === 0) return;
  
    const headers = Object.keys(this.data[0]);
    const headerRow = dataTableElement.insertRow();
    headers.forEach(header => {
      const th = document.createElement('th');
      th.style.fontWeight = 'bold';
      th.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-100');
      th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
      headerRow.appendChild(th);
    }); 
    
    this.data.forEach(row => {
      const dataRow = dataTableElement.insertRow();
      headers.forEach(header => {
        const cell = dataRow.insertCell();
        cell.classList.add('border', 'border-gray-300', 'px-4', 'py-2');
        cell.textContent = row[header as keyof DataTableType] || '';
      });
    });
  }
  
}