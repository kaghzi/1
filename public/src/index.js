import Utf8Base64Converter from '../src/Utf8Base64Converter.js'
import imageUtils from './imageUtils.js'

const root = '//BRESDSK-MAHMED/DATA';
var currentpath= root;
console.log('starting client.......')
const view = '<H1>Hello World!....1234</H1>'

const divMain = document.getElementById('divMain');
if(divMain) {
    divMain.innerHTML=view;
}

main();

async function main() {
    console.log('in Main....');
    try {
        const jsonData = await fetchDataFromUrl('url/metadata/' + Utf8Base64Converter.encodeToBase64(currentpath) + '/metadata.json');
        // Use the fetched JSON data here
        console.log('Fetched data:', jsonData);
        jsonData.map(p=>console.log(p.fn, Utf8Base64Converter.decodeFromBase64(p.b64fn)));

        const onlyPics = jsonData.filter(p=>p.isImage);
        console.log(onlyPics);
        const onlyFolders = jsonData.filter(p=>p.isDir);
        console.log(onlyFolders);

        const thumbnails = await fetchDataFromUrl('url/thumbnails/' + Utf8Base64Converter.encodeToBase64(currentpath) + "/thumbs.json");
        console.log(thumbnails);

        onlyPics.map((item, i) => 
            {
                console.log(item.b64fn);
                if(item.isImage){

                    addImage(thumbnails.find(tn => tn.b64fn===item.b64fn), onlyPics, i);
                }
            }
        );

        onlyFolders.map((item, i) => 
            {
                console.log(item.b64fn);
                addFolder(item);
            
            }
        );

      } catch (error) {
        // Handle errors here
        console.error('Error:', error);
      }
}


function addFolder(item)
{    
    const imgElement = document.createElement("img");
    imgElement.alt=item.fn;

    const linkElement = document.createElement("a");
    linkElement.href = '/url/folder/' + item.b64fn;
    linkElement.appendChild(imgElement);
    linkElement.img = imgElement;

    document.getElementById('divDirs').appendChild(linkElement);
    return;
}

async function fetchDataFromUrl(url) {
    console.log('in fetch...');
    try {
        const response = await fetch(url);
    
        if (response.ok) 
        {
            const data = await response.json(); // You can use .text() for plain text or .blob() for binary data
            console.log(data);
            return data;
        }
        else
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
  }


 
function imgClick(onlyPics, i)
{
    console.log('in imgClick...........',i,onlyPics);
    (new imageUtils(onlyPics)).showImageFullscreen(i);
}


function addImage(imgData, jsonData, i)
{
    
    console.log(imgData);
    const imgElement = document.createElement("img");
    imgElement.src="data:image/png;base64," +imgData.th;
    imgElement["data-b64fn"]=imgData.b64fn;

    const xthis =this;
    const linkElement = document.createElement("a");
    linkElement.onclick = (e) => imgClick(jsonData, i);
    linkElement.appendChild(imgElement);
    linkElement.img = imgElement;

    const divElement = document.createElement("div");
    divElement.className="c1";

    divElement.appendChild(linkElement);


    //document.getElementById('divThumbs').appendChild(linkElement);
    document.getElementById('divThumbs').appendChild(divElement);
}

