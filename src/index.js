import express from 'express';
import url from 'url';


import FileLister from '../src/file1.js'
import Utf8Base64Converter from '../src/Utf8Base64Converter.js'
import debugPkg from 'debug';
const debug = debugPkg('INDEX');

const fl = new FileLister();

//let folderPath = '//BRESDSK-MAHMED/Data/Pictures/Equations';

console.log('starting server.......1');

const app=express();

app.listen(3000, ()=>{debug('listening on port: 3000')});
app.use(express.static('public/'));
app.get('/url/metadata/*', f1);
app.get('/url/thumb*', f2);
app.get('/url/image/*', f3);
app.get('/url/folder/*', f4);
app.get('/url/batch/*', f5);

async function f1(req, res, next){
    debug('\n\n\n\nIn function f1.....');
    const b64fn = req.path.replace('/url/metadata/','').replace('/metadata.json','');
    const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + '/';
    debug(b64fn, folderpath);
    if((await fl.createMetaData(folderpath)) === true) res.sendFile(folderpath + 'metadata.json');
}

async function f2(req, res, next){
    debug('\n\n\n\nIn function f2.....');
    const b64fn = req.path.replace('/url/thumbnails/','').replace('/thumbs.json','');
    const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + '/';
    debug(b64fn, folderpath);
    if((await fl.createThumbnail(folderpath)) === true) res.sendFile(folderpath + 'thumbs.json');
}

async function f3(req, res, next){
    debug('In function f3.....');
    const b64fn = (req.path.replace('/url/image/','') + '__EOL__').replace('.jpg__EOL__','');
    console.log(b64fn);
    const parts = b64fn.split('__SLASH__');
    debug(parts);
    const filename = Utf8Base64Converter.decodeFromBase64(parts[0]) + '/' + Utf8Base64Converter.decodeFromBase64(parts[1]);
    debug(b64fn, filename);
    res.sendFile(filename);
}

async function f4(req, res, next){
    debug('In function f4.....');
    const b64fn = req.path.replace('/url/folder/','');
    console.log(b64fn);
    if(b64fn=='zzz')
    {
        folderPath  = '//BRESDSK-MAHMED/Data';

    }
    else if(b64fn=='')
    {
        folderPath  = '//BRESDSK-MAHMED/Data/Pictures/Equations';

    }
    else
    {
        const filename = Utf8Base64Converter.decodeFromBase64(b64fn);
        folderPath  = folderPath + '/' + filename;
    }
    console.log('folderPath', folderPath)
    console.log('redirecting.....');
    res.redirect('/');
}


async function f5(req, res, next){
    debug('\n\n\n\nIn function f5.....');
    const b64fn = req.path.replace('/url/batch/','');
    const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + '/';
    debug(b64fn, folderpath);

    let x = await f6(folderpath);
    // debug('dddddddddddddddddddddddddddddddddddddddddddddddddddd');
    // debug(x);
    // let i=0;
    // for(i=0; i<x.length; i++)
    // {
    //     if(x[i].isDir){
    //         debug(x[i].fn);
    //         f6(folderpath + x[i].fn + '/');
    //     }
    // }
}

async function f6(folderpath){
    debug('\n\n\n\nIn function f6.....' + folderpath);
    if((await fl.createMetaData(folderpath)) === true) {
        await fl.createThumbnail(folderpath);

        const x= fl.readJSON(folderpath + 'metadata.json');
        for(let i=0; i<x.length; i++)
        {
            if(x[i].isDir){
                debug(x[i].fn);
                await f6(folderpath + x[i].fn + '/');
            }
        }
    }
    return null;
}