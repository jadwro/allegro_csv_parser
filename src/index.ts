import { AllegroDataTableHandler } from './Allegro/AllegroDataTableHandler';
import { DataDisplay } from './DataDisplay';
import { EmpikDataTableHandler } from './Empik/EmpikDataTableHandler';
import { ShopifyDataTableHandler } from './Shopify/ShopifyDataTableHandler';
import { FileHandler } from './FileHandler';
import './styles/tailwind.css';
import { DataTableType } from './types/DataTableType';
import { SalePlatform } from './types/SalePlatform';

const uploadInputAllegro = document.getElementById('uploadCsvFileAllegro') as HTMLInputElement;
const uploadInputEmpik = document.getElementById('uploadCsvFileEmpik') as HTMLInputElement;
const uploadInputShopify = document.getElementById('uploadCsvFileShopify') as HTMLInputElement;

const generateButton = document.getElementById('generateButton') as HTMLButtonElement;
const dataTableElement = document.getElementById('dataTable') as HTMLTableElement;
const copyButton = document.getElementById('copyContentButton') as HTMLButtonElement;
const monthInput = document.getElementById('monthSelect') as HTMLSelectElement;
const yearInput = document.getElementById('year') as HTMLInputElement;

const dataDisplay = new DataDisplay();

generateButton.addEventListener('click', async () => {
  const suffix = `${monthInput.value}/${yearInput.value.slice(-2)}`;

  const allegroData = await processAllegroFile(suffix);
  const empikData = await processEmpikFile(suffix);
  const shopifyData = await processShopifyFile(suffix);

  if(allegroData === undefined && empikData === undefined && shopifyData === undefined) {
    throw Error('Upload at least one CSV!');
  }

  const combinedData: DataTableType[] = [
    ...(allegroData ?? []),
    ...(empikData ?? []),
    ...(shopifyData ?? [])
  ].sort((a, b) => parseCustomDate(a.date) - parseCustomDate(b.date));

  dataDisplay.buildTable(dataTableElement, combinedData);
  dataDisplay.showCopyButton(copyButton);
});

copyButton.addEventListener('click', () => {
  dataDisplay.copyContent(dataTableElement);
});

async function processAllegroFile(suffix: string): Promise<DataTableType[] | undefined> {
  if (!uploadInputAllegro.files || !uploadInputAllegro.files[0]) return;

  const fileHandlerAllegro = new FileHandler(uploadInputAllegro.files[0], SalePlatform.ALLEGRO);
  const data = await fileHandlerAllegro.getParsedData();
  
  const dataTableAllegro = new AllegroDataTableHandler(suffix, data.orders, data.products);
  return await dataTableAllegro.matchItemsWithOrders();
}

async function processEmpikFile(suffix: string): Promise<DataTableType[] | undefined> {
  if (!uploadInputEmpik.files || !uploadInputEmpik.files[0]) return;
  
  const fileHandlerEmpik = new FileHandler(uploadInputEmpik.files[0], SalePlatform.EMPIK);
  const data = await fileHandlerEmpik.getParsedData();

  const dataTableEmpik = new EmpikDataTableHandler(suffix, data.orders, data.products);
  return dataTableEmpik.matchItemsWithOrders();
}

async function processShopifyFile(suffix: string): Promise<DataTableType[] | undefined> {
  if (!uploadInputShopify.files || !uploadInputShopify.files[0]) return;
  
  const fileHandlerShopify = new FileHandler(uploadInputShopify.files[0], SalePlatform.SHOPIFY);
  const data = await fileHandlerShopify.getParsedData();
  
  const dataTableShopify = new ShopifyDataTableHandler(suffix, data.orders, data.products);
  return dataTableShopify.matchItemsWithOrders();
}

function parseCustomDate(dateString: string): number {
  const [day, month, year] = dateString.split(".");
  const isoString = `${year}-${month}-${day}`;
  return new Date(isoString).getTime();
}