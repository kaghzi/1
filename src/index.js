import express from 'express';
import url from 'url';


import FileLister from '../src/file1.js'
import Utf8Base64Converter from '../src/Utf8Base64Converter.js'
import debugPkg from 'debug';
const debug = debugPkg('INDEX');


let folderPath = '//BRESDSK-MAHMED/Data/Pictures/Equations';

console.log('starting server.......1');

const app=express();

app.listen(3000, ()=>{debug('listening on port: 3000')});
app.use(express.static('public/'));
app.get('/url/meta*', f1);
app.get('/url/thumb*', f2);
app.get('/url/image/*', f3);
app.get('/url/folder/*', f4);

async function f1(req, res, next){
    debug('In function f1.....');
    let fl = new FileLister(folderPath);
    const fn = await fl.createMetaData();
    res.sendFile(fn);
    // const x = fl.listFiles();
    // let i=0;
    // const y = x.map(value => ({ order: i++, "fn": value, "b64fn": Utf8Base64Converter.encodeToBase64(value)}));
    // console.log(y);
    // res.json(y);
}

async function f2(req, res, next){
    console.log('In function f2.....');
    let fl = new FileLister(folderPath);
    const fn = await fl.createThumbnail();
    console.log(fn);
    res.sendFile(fn);
    // const x = fl.listFiles();
    // let i=0;
    // const y = x.map(value => ({ order: i++, "fn": value, "b64fn": Utf8Base64Converter.encodeToBase64(value)}));
    // console.log(y);
    // res.json(y);
}

async function f3(req, res, next){
    debug('In function f3.....');
    const b64fn = (req.path.replace('/url/image/','') + '__EOL__').replace('.jpg__EOL__','');
    console.log(b64fn);
    const filename = Utf8Base64Converter.decodeFromBase64(b64fn);
    res.sendFile(folderPath + '/' + filename);
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