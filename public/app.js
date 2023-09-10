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
    currentIndex;
    keyDownListener;
    b64currentpath;
    constructor(jsonData, b64currentpath2) {
      this.jsonData = jsonData;
      this.b64currentpath = b64currentpath2;
    }
    showImageFullscreen(i) {
      console.log("In showImageFullscreen..........", i);
      this.currentIndex = i;
      const b64fn = this.jsonData[i].b64fn;
      console.log(b64fn);
      const imageUrl = "/url/image/" + this.b64currentpath + "__SLASH__" + b64fn + ".jpg";
      const fullscreenDiv = document.createElement("div");
      fullscreenDiv.id = "fullscreenDiv";
      fullscreenDiv.style.position = "fixed";
      fullscreenDiv.style.top = "0";
      fullscreenDiv.style.left = "0";
      fullscreenDiv.style.width = "100%";
      fullscreenDiv.style.height = "100%";
      fullscreenDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      const img = new Image();
      img.id = "imgFullScreen";
      img.src = imageUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      fullscreenDiv.appendChild(img);
      document.body.appendChild(fullscreenDiv);
      fullscreenDiv.addEventListener("dblclick", () => {
        this.toggleFullscreen(fullscreenDiv);
      });
      this.keyDownListener = (e) => {
        this.keypressHandler(e, fullscreenDiv);
      };
      document.addEventListener("keydown", this.keyDownListener);
    }
    clickHandler(e) {
      console.log("In clickHandler..........", e);
      console.log(e.target.parentElement);
      const fullscreenDiv = e.target;
      if (document.fullscreenElement) {
        document.exitFullscreen();
        e.target.remove();
      } else {
        fullscreenDiv.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      }
      console.log(document.activeElement);
    }
    keypressHandler(e, fullscreenDiv) {
      console.log("In keypressHandler..........", e);
      if (e.key === "Escape") {
        if (document.fullscreenElement)
          document.exitFullscreen();
        document.removeEventListener("keydown", this.keyDownListener);
        fullscreenDiv.remove();
      }
      if (e.key === "ArrowRight") {
        this.showNextImage();
      }
      if (e.key === "ArrowLeft") {
        this.showPrevImage();
      }
    }
    showNextImage() {
      console.log("In .............showNextImage", this.currentIndex);
      if (this.currentIndex + 1 < this.jsonData.length) {
        this.currentIndex++;
        const imgFullScreen = document.getElementById("imgFullScreen");
        const b64fn = this.jsonData[this.currentIndex].b64fn;
        console.log(b64fn);
        const imageUrl = "/url/image/" + this.b64currentpath + "__SLASH__" + b64fn + ".jpg";
        imgFullScreen.src = imageUrl;
      }
    }
    showPrevImage() {
      console.log("In .............showPrevImage", this.currentIndex);
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const imgFullScreen = document.getElementById("imgFullScreen");
        const b64fn = this.jsonData[this.currentIndex].b64fn;
        console.log(b64fn);
        const imageUrl = "/url/image/" + this.b64currentpath + "__SLASH__" + b64fn + ".jpg";
        imgFullScreen.src = imageUrl;
      }
    }
    // Function to enter fullscreen
    toggleFullscreen(element) {
      if (document.fullscreenElement) {
        if (document.fullscreenElement === element)
          document.exitFullscreen();
      } else {
        element.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      }
    }
  };

  // src/index.js
  var root = "//BRESDSK-MAHMED/DATA/pictures/equations";
  var currentpath = root;
  var currentfolder = "";
  var b64currentpath;
  console.log("starting client.......");
  var view = "<H1>Hello World!....</H1>";
  var divMain = document.getElementById("divMain");
  if (divMain) {
    divMain.innerHTML = view;
  }
  main();
  function clean() {
    const divThumbs = document.getElementById("divThumbs");
    while (divThumbs.firstChild)
      divThumbs.removeChild(divThumbs.firstChild);
    const divDirs = document.getElementById("divDirs");
    while (divDirs.firstChild)
      divDirs.removeChild(divDirs.firstChild);
  }
  async function main() {
    console.log("in Main....");
    clean();
    try {
      b64currentpath = Utf8Base64Converter.encodeToBase64(currentpath);
      const jsonData = await fetchDataFromUrl("url/metadata/" + b64currentpath + "/metadata.json");
      console.log("Fetched data:", jsonData);
      jsonData.map((p) => console.log(p.fn, Utf8Base64Converter.decodeFromBase64(p.b64fn)));
      const onlyPics = jsonData.filter((p) => p.isImage);
      console.log(onlyPics);
      const onlyFolders = jsonData.filter((p) => p.isDir);
      console.log(onlyFolders);
      const thumbnails = await fetchDataFromUrl("url/thumbnails/" + b64currentpath + "/thumbs.json");
      console.log(thumbnails);
      onlyPics.map(
        (item, i) => {
          console.log(item.b64fn);
          if (item.isImage) {
            addImage(thumbnails.find((tn) => tn.b64fn === item.b64fn), onlyPics, i);
          }
        }
      );
      addFolder({ fn: "..(Parent)  " });
      onlyFolders.map(
        (item, i) => {
          console.log(item.b64fn);
          addFolder(item);
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
  function addFolder(item) {
    const imgElement = document.createElement("img");
    imgElement.alt = item.fn;
    const linkElement = document.createElement("a");
    linkElement.onclick = (e) => folderClick(item);
    linkElement.appendChild(imgElement);
    linkElement.img = imgElement;
    document.getElementById("divDirs").appendChild(linkElement);
    return;
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
  function imgClick(onlyPics, i, b64currentpath2) {
    console.log("in imgClick...........", i, onlyPics, b64currentpath2);
    new imageUtils(onlyPics, b64currentpath2).showImageFullscreen(i);
  }
  function folderClick(item) {
    console.log("in folderClick...........", item);
    if (item.fn.includes("(Parent)")) {
      currentpath = currentpath.replace("/" + currentfolder, "");
    } else {
      currentpath = currentpath + "/" + item.fn;
      currentfolder = item.fn;
    }
    main();
  }
  function addImage(imgData, jsonData, i) {
    console.log(imgData);
    const imgElement = document.createElement("img");
    imgElement.src = "data:image/png;base64," + imgData.th;
    const xthis = this;
    const linkElement = document.createElement("a");
    linkElement.onclick = (e) => imgClick(jsonData, i, b64currentpath);
    linkElement.appendChild(imgElement);
    linkElement.img = imgElement;
    const divElement = document.createElement("div");
    divElement.className = "c1";
    divElement.appendChild(linkElement);
    document.getElementById("divThumbs").appendChild(divElement);
  }
})();
