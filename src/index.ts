import { DataDisplay } from './DataDisplay';
import { FileHandler } from './FileHandler';
import './styles/tailwind.css';

const uploadInput = document.getElementById('uploadCsvFile') as HTMLInputElement;
const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
const dataTableElement = document.getElementById('dataTable') as HTMLTableElement;
const copyButton = document.getElementById('copyContentButton') as HTMLButtonElement;

const dataDisplay = new DataDisplay();

uploadButton.addEventListener('click', async () => {
  if (uploadInput.files && uploadInput.files[0]) {
    const fileHandler = new FileHandler(uploadInput.files[0]);
    await fileHandler.uploadAndProcessFile();
    const data = fileHandler.getParsedData();
    
    dataDisplay.displayTable(dataTableElement, data.orders, data.products);
    dataDisplay.showCopyButton(copyButton);
  } else {
    alert("Please select a CSV file.");
  }
});

copyButton.addEventListener('click', () => {
  dataDisplay.copyContent(dataTableElement);
});