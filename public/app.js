(() => {
  // src/Utf8Base64Converter.js
  var Utf8Base64Converter = class {
    static encodeToBase64(utf8String) {
      const encoded = btoa(unescape(encodeURIComponent(utf8String)));
      return encoded;
    }
    static decodeFromBase64(base64String) {
      const decoded = decodeURIComponent(escape(atob(base64String)));
      return decoded;
    }
  };

  // src/imageUtils.js
  var imageUtils = class {
    jsonData;
    constructor(jsonData) {
      this.jsonData = jsonData;
    }
    // showImageFullscreenold(i) {
    //   console.log('In showImageFullscreen..........', i);
    //   const b64fn = this.jsonData[i].b64fn;
    //   console.log(b64fn);
    //   const imageUrl = "/url/image/"+b64fn + '.jpg';
    //   // Create an image element
    //   const img = new Image();
    //   img.src = imageUrl;
    //   // Style the image for fullscreen display
    //   img.style.position = 'fixed';
    //   img.style.top = '0';
    //   img.style.left = '0';
    //   img.style.width = '100%';
    //   img.style.height = '100%';
    //   img.style.objectFit = 'contain';
    //   img.style.backgroundColor = 'black'; // Optional: set background color
    //   // Add a click event listener to toggle fullscreen
    //   img.addEventListener('click', this.clickHandler);
    //   img.addEventListener('keypress', this.keypressHandler);
    //   // Append the image to the document body
    //   document.body.appendChild(img);
    // }
    showImageFullscreen(i) {
      console.log("In showImageFullscreen..........", i);
      const b64fn = this.jsonData[i].b64fn;
      console.log(b64fn);
      const imageUrl = "/url/image/" + b64fn + ".jpg";
      const fullscreenDiv = document.createElement("div");
      fullscreenDiv.style.position = "fixed";
      fullscreenDiv.style.top = "0";
      fullscreenDiv.style.left = "0";
      fullscreenDiv.style.width = "100%";
      fullscreenDiv.style.height = "100%";
      fullscreenDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      const img = new Image();
      img.src = imageUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      fullscreenDiv.appendChild(img);
      document.body.appendChild(fullscreenDiv);
      fullscreenDiv.addEventListener("click", this.clickHandler);
      fullscreenDiv.addEventListener("keypress", this.keypressHandler);
    }
    clickHandler(e) {
      console.log("In clickHandler..........", e);
      console.log(e.target.parentElement);
      const fullscreenDiv = e.target.parentElement;
      if (document.fullscreenElement) {
        document.exitFullscreen();
        fullscreenDiv.remove();
      } else {
        fullscreenDiv.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      }
    }
    keypressHandler(e) {
      console.log("In keypressHandler..........");
      const img = e.target;
      if (!document.fullscreenElement) {
        img.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      } else {
        document.exitFullscreen();
        img.remove();
      }
    }
  };

  // src/index.js
  console.log("starting client.......");
  var view = "<H1>Hello World!....1234</H1>";
  var divMain = document.getElementById("divMain");
  if (divMain) {
    divMain.innerHTML = view;
  }
  main();
  async function main() {
    console.log("in Main....");
    try {
      const jsonData = await fetchDataFromUrl("url/metadata.json");
      console.log("Fetched data:", jsonData);
      jsonData.map((p) => console.log(p.fn, Utf8Base64Converter.decodeFromBase64(p.b64fn)));
      const thumbnails = await fetchDataFromUrl("url/thumb.json");
      console.log(thumbnails);
      jsonData.map(
        (item, i) => {
          console.log(item.b64fn);
          if (item.fn.endsWith("jpg")) {
            addImage(thumbnails.find((tn) => tn.b64fn === item.b64fn), jsonData, i);
          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function fetchDataFromUrl(url) {
    console.log("in fetch...");
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  function imgClick(jsonData, i) {
    console.log("in imgClick...........", i, jsonData);
    const iu = new imageUtils(jsonData);
    iu.showImageFullscreen(i);
  }
  function addImage(imgData, jsonData, i) {
    {
      console.log(imgData);
      const imgElement = document.createElement("img");
      imgElement.src = "data:image/png;base64," + imgData.th;
      imgElement["data-b64fn"] = imgData.b64fn;
      const xthis = this;
      const linkElement = document.createElement("a");
      linkElement.onclick = (e) => imgClick(jsonData, i);
      linkElement.appendChild(imgElement);
      linkElement.img = imgElement;
      const divElement = document.createElement("div");
      divElement.className = "c1";
      divElement.appendChild(linkElement);
      document.getElementById("divThumbs").appendChild(divElement);
    }
  }
})();
