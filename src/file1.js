import fs from 'fs';
import path from 'path';
import imageThumbnail from 'image-thumbnail';
import debugPkg from 'debug';
import mime from 'mime-types'

const debug = debugPkg('FILES>>> ')

import Utf8Base64Converter from '../src/Utf8Base64Converter.js'

export default class FileLister {

  listFiles(folderPath) {
    console.log('In listFiles......', folderPath);
    try {
      const fileNames = fs.readdirSync(folderPath);
      return fileNames;
    } catch (error) {
      console.error(`Error reading files from ${this.folderPath}: ${error.message}`);
      return [];
    }
  }

  readfile(filepath){
    debug('In readfile............(' + filepath + ')');
    return fs.readFileSync(filepath, 'utf8');
  }

  readJSON(filepath){
    debug('In readJSON......');
    try {
        const jsonData = JSON.parse(this.readfile(filepath));
        debug('JSON data:', jsonData);
        return jsonData;
    } catch (ex){
        console.error('Error parsing JSON:', ex);
    }     
  }
  async createMetaData(folderPath) {    
    debug('In createMetaData......', folderPath);
    if(!fs.existsSync(folderPath + 'metadata.json'))
    {
        const x = this.listFiles(folderPath);
        console.log('number of items in folder: =====> ' + x.length.toString());
        let i=0;
        const json = x.map(value => 
            {
                //console.log(value);
                const stats = fs.statSync(folderPath + value);
                //console.log(stats);
                const mimeType = mime.lookup(folderPath  + value);
                //console.log(mimeType);
                return { order: i++, "fn": value, "b64fn": Utf8Base64Converter.encodeToBase64(value), isDir: (stats.isDirectory()), mimeType, isImage: (mimeType.toString().startsWith('image/'))};
            }
        )
        //console.log(json);
        await fs.writeFileSync(folderPath + 'metadata.json', JSON.stringify(json, null, 2), 'utf8', (err)=>{console.log({err})});
    }
    return true;
  }


  async createThumbnail(folderPath) {    
    debug('In createThumbnail......', folderPath);
    if(!fs.existsSync(folderPath + 'thumbs.json'))
    {
        const x = this.readJSON(folderPath + 'metadata.json');
        let i=0;
        let json = [];

        for(i=0; i<x.length; i++)
        {
            const value = x[i].fn;
            debug(folderPath + value);
            if(x[i].isImage){
                const thData = await this.getThumbnailStr(folderPath  + value);
                json.push({b64fn: (x[i].b64fn), th: thData});
                console.log(json.length);
                //console.log(json);
            }
        }

        debug('all thumbnails done.......');
        await fs.writeFileSync(folderPath + 'thumbs.json', JSON.stringify(json, null, 2), 'utf8', (err)=>{console.log({err})});
    }
    return true;
  }

    async getThumbnailStr(imgPath)
    {
        console.log('in file1 getThumbnailStr...' + imgPath);

        try {
            const thumbnail = await imageThumbnail(
                imgPath,
                {   percentage: 100,
                    width : 200}
                );
            const base64Str = await thumbnail.toString('base64');
            //console.log('===================================      ' + imgPath + '         ===================================================')
            //console.log(base64Str);
            //console.log(typeof base64Str);
            //console.log( base64Str.length);
            return base64Str || '';
            } catch (err) {
            console.error(err);
            return '';
            }
    }
}