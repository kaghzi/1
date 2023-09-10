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
    static imgClick(e) {
      const img = e.target;
      const b64fn = img["data-b64fn"];
      console.log(b64fn);
      const imageUrl = "/url/image/" + b64fn + "?path=ttt";
      const iu = new imageUtils();
      iu.showImageFullscreen(imageUrl);
    }
    showImageFullscreen(imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.style.position = "fixed";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.backgroundColor = "black";
      img.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          img.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable full-screen mode:", err);
          });
        } else {
          document.exitFullscreen();
          img.remove();
        }
      });
      document.body.appendChild(img);
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
        (item) => {
          console.log(item.b64fn);
          if (item.fn.endsWith("jpg")) {
            addImage(thumbnails.find((tn) => tn.b64fn === item.b64fn));
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
  function addImage(imgData) {
    {
      console.log(imgData);
      const imgElement = document.createElement("img");
      imgElement.src = "data:image/png;base64," + imgData.th;
      imgElement["data-b64fn"] = imgData.b64fn;
      const xthis = this;
      const linkElement = document.createElement("a");
      linkElement.onclick = imageUtils.imgClick;
      linkElement.appendChild(imgElement);
      linkElement.img = imgElement;
      const divElement = document.createElement("div");
      divElement.className = "c1";
      divElement.appendChild(linkElement);
      document.getElementById("divThumbs").appendChild(divElement);
    }
  }
})();
