import fs from 'fs';
import path from 'path';

export default class FileLister {
  constructor(folderPath) {
    this.folderPath = '.';
  }

  listFiles() {
    console.log('In listFiles......');
    try {
      const fileNames = fs.readdirSync(this.folderPath);
      return fileNames;
    } catch (error) {
      console.error(`Error reading files from ${this.folderPath}: ${error.message}`);
      return [];
    }
  }
}