import fs from 'fs';
import path from 'path';
import imageThumbnail from 'image-thumbnail';
import debugPkg from 'debug';
import mime from 'mime-types'

const debug = debugPkg('FILES>>> ')

import Utf8Base64Converter from '../src/Utf8Base64Converter.js'

export default class FileLister {
  constructor(folderPath) {
    this.folderPath = folderPath;
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
  async createMetaData() {    
    debug('In createMetaData......');
    if(!fs.existsSync(this.folderPath + '/' + 'metadata.json'))
    {
        const x = this.listFiles();
        let i=0;
        const json = x.map(value => 
            {
                const stats = fs.statSync(this.folderPath + '/' + value);
                const mimeType = mime.lookup(this.folderPath + '/' + value);
                return { order: i++, "fn": value, "b64fn": Utf8Base64Converter.encodeToBase64(value), isDir: (stats.isDirectory()), mimeType, isImage: (mimeType.toString().startsWith('image/'))};
            }
        )
        console.log(json);
        await fs.writeFileSync(this.folderPath + '/' + 'metadata.json', JSON.stringify(json, null, 2), 'utf8', (err)=>{console.log({err})});
    }
    return this.folderPath + '/' + 'metadata.json';
  }


  async createThumbnail() {    
    debug('In createThumbnail......');
    if(!fs.existsSync(this.folderPath + '/' + 'thumb.json'))
    {
        const x = this.readJSON(this.folderPath + '/' + 'metadata.json');
        let i=0;
        let json = [];

        for(i=0; i<x.length; i++)
        {
            const value = x[i].fn;
            console.log(this.folderPath + '/' + value);
            if(x[i].isImage){
                const thData = await this.getThumbnailStr(this.folderPath + '/' + value);
                json.push({b64fn: (x[i].b64fn), th: thData});
                console.log(json.length);
                //console.log(json);
            }
        }

        // await x.forEach(async value => {
        //         console.log(this.folderPath + '/' + value);
        //         if(value.endsWith('jpg')){
        //             const thData = await this.getThumbnailStr(this.folderPath + '/' + value);
        //             console.log(thData.length);
        //             json.push({th: thData});
        //             console.log(json.length);
        //         }
        //     }
        // )
        console.log('all thumbnails done.......')
        //const json = x.map(async value => { console.log(value); if(value.endsWith('jpg')) return ({'th': (await this.getThumbnailStr(this.folderPath + '/' + value))})}); 
        console.log('000000000000000000........................000000000000000000000000000000000000000000000000000000000000..........................00000000000000000000000000000');
        //console.log(json);
        await fs.writeFileSync(this.folderPath + '/' + 'thumb.json', JSON.stringify(json, null, 2), 'utf8', (err)=>{console.log({err})});
    }
    return this.folderPath + '/' + 'thumb.json';
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
            console.log('===================================      ' + imgPath + '         ===================================================')
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