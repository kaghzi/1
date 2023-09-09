import express from 'express';
import FileLister from '../src/file1.js'

const fl = new FileLister();

console.log('starting server.......1');

const app=express();

app.listen(3000, ()=>{console.log('listening on port: 3000')});
app.use(express.static('public/'));
app.get('/url', f1);

function f1(req, res, next){
    console.log('In function f1.....');
    const x = fl.listFiles();
    res.json(x);
}