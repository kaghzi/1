import express from 'express';

console.log('starting server.......1');

const app=express();

app.listen(3000, ()=>{console.log('listening on port: 3000')});
app.use(express.static('public/'));