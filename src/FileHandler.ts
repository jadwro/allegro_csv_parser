import { ParsedData } from './types/ParsedData';
import { AllegroFileHandler } from './Allegro/AllegroFileHandlers';
import { EmpikFileHandler } from './Empik/EmpikFileHandler';
import { ShopifyFileHandler } from './Shopify/ShopifyFileHandler'
import { SalePlatform } from './types/SalePlatform';

export class FileHandler {
  private parsedData: ParsedData;

  constructor(private file: File, private salePlatform: SalePlatform) {
  }

  async getParsedData() {
    await this.uploadAndProcessFile(this.salePlatform);

    if(this.parsedData === undefined) {
      throw new Error('Orders or products are undefined!');
    }
    
    return this.parsedData;
  }

  private async uploadAndProcessFile(salePlatform: SalePlatform) {
    const fileContent = await this.file.text();
    
    switch(salePlatform){
      case SalePlatform.ALLEGRO:
        this.parsedData = await new AllegroFileHandler(fileContent).processFile();
        break;
      case SalePlatform.EMPIK:
        this.parsedData = await new EmpikFileHandler(fileContent).processFile();
        break;
      case SalePlatform.SHOPIFY:
        this.parsedData = await new ShopifyFileHandler(fileContent).processFile();
        break;
      default:
        throw Error(`***** ${salePlatform} sale platform doesn't exist! *****`);
    }
  }
}