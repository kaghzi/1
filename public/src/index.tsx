import React from 'react';
import ReactDOMServer from "react-dom/server";

console.log('starting client.......');


const n=123;
const v = (<h1>Hello World!....{n+5}</h1>);

const mainDiv = document.getElementById('mainDiv') as HTMLDivElement;
if(mainDiv) {
    mainDiv.innerHTML=ReactDOMServer.renderToString(v);
}
