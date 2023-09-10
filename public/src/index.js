import Utf8Base64Converter from '../src/Utf8Base64Converter.js'
import imageUtils from './imageUtils.js'

const root = '//BRESDSK-MAHMED/DATA/pictures/equations';
var currentpath= root;
var currentfolder = '';
var b64currentpath;

console.log('starting client.......')
const view = '<H1>Hello World!....</H1>'

const divMain = document.getElementById('divMain');
if(divMain) {
    divMain.innerHTML=view;
}

main();

function clean()
{
    const divThumbs = document.getElementById('divThumbs');
    while (divThumbs.firstChild) divThumbs.removeChild(divThumbs.firstChild);

    const divDirs = document.getElementById('divDirs');
    while (divDirs.firstChild) divDirs.removeChild(divDirs.firstChild);
}

async function main() {
    console.log('in Main....');
    clean();
    try {
        b64currentpath = Utf8Base64Converter.encodeToBase64(currentpath);
        const jsonData = await fetchDataFromUrl('url/metadata/' + b64currentpath + '/metadata.json');
        // Use the fetched JSON data here
        console.log('Fetched data:', jsonData);
        jsonData.map(p=>console.log(p.fn, Utf8Base64Converter.decodeFromBase64(p.b64fn)));

        const onlyPics = jsonData.filter(p=>p.isImage);
        console.log(onlyPics);
        const onlyFolders = jsonData.filter(p=>p.isDir);
        console.log(onlyFolders);

        const thumbnails = await fetchDataFromUrl('url/thumbnails/' + b64currentpath + "/thumbs.json");
        console.log(thumbnails);

        onlyPics.map((item, i) => 
            {
                console.log(item.b64fn);
                if(item.isImage){

                    addImage(thumbnails.find(tn => tn.b64fn===item.b64fn), onlyPics, i);
                }
            }
        );

        addFolder({fn: '..(Parent)  '});
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
    linkElement.onclick = (e) => folderClick(item);
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


 
  function imgClick(onlyPics, i, b64currentpath)
  {
      console.log('in imgClick...........',i,onlyPics,b64currentpath);
      (new imageUtils(onlyPics, b64currentpath)).showImageFullscreen(i);
  }

  function folderClick(item)
  {
      console.log('in folderClick...........',item);
      if(item.fn.includes("(Parent)"))
      {
        currentpath = currentpath.replace('/' + currentfolder, '');
      }
      else
      {
        currentpath = currentpath + '/' + item.fn;
        currentfolder = item.fn;
      }
      main();
  }
    

function addImage(imgData, jsonData, i)
{
    
    console.log(imgData);
    const imgElement = document.createElement("img");
    imgElement.src="data:image/png;base64," +imgData.th;

    const xthis =this;
    const linkElement = document.createElement("a");
    linkElement.onclick = (e) => imgClick(jsonData, i, b64currentpath);
    linkElement.appendChild(imgElement);
    linkElement.img = imgElement;

    const divElement = document.createElement("div");
    divElement.className="c1";

    divElement.appendChild(linkElement);


    //document.getElementById('divThumbs').appendChild(linkElement);
    document.getElementById('divThumbs').appendChild(divElement);
}

