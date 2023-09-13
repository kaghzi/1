var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.js
var import_express = __toESM(require("express"), 1);
var import_url = __toESM(require("url"), 1);

// src/file1.js
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_image_thumbnail = __toESM(require("image-thumbnail"), 1);
var import_debug = __toESM(require("debug"), 1);
var import_mime_types = __toESM(require("mime-types"), 1);

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

// src/file1.js
var debug = (0, import_debug.default)("FILES>>> ");
var FileLister = class {
  listFiles(folderPath2) {
    console.log("In listFiles......", folderPath2);
    try {
      const fileNames = import_fs.default.readdirSync(folderPath2);
      return fileNames;
    } catch (error) {
      console.error(`Error reading files from ${this.folderPath}: ${error.message}`);
      return [];
    }
  }
  readfile(filepath) {
    debug("In readfile............(" + filepath + ")");
    return import_fs.default.readFileSync(filepath, "utf8");
  }
  readJSON(filepath) {
    debug("In readJSON......");
    try {
      const jsonData = JSON.parse(this.readfile(filepath));
      debug("JSON data:", jsonData);
      return jsonData;
    } catch (ex) {
      console.error("Error parsing JSON:", ex);
    }
  }
  async createMetaData(folderPath2) {
    debug("In createMetaData......", folderPath2);
    if (!import_fs.default.existsSync(folderPath2 + "metadata.json")) {
      const x = this.listFiles(folderPath2);
      console.log("number of items in folder: =====> " + x.length.toString());
      let i = 0;
      const json = x.map(
        (value) => {
          const stats = import_fs.default.statSync(folderPath2 + value);
          const mimeType = import_mime_types.default.lookup(folderPath2 + value);
          return { order: i++, "fn": value, "b64fn": Utf8Base64Converter.encodeToBase64(value), isDir: stats.isDirectory(), mimeType, isImage: mimeType.toString().startsWith("image/") };
        }
      );
      await import_fs.default.writeFileSync(folderPath2 + "metadata.json", JSON.stringify(json, null, 2), "utf8", (err) => {
        console.log({ err });
      });
    }
    return true;
  }
  async createThumbnail(folderPath2) {
    debug("In createThumbnail......", folderPath2);
    if (!import_fs.default.existsSync(folderPath2 + "thumbs.json")) {
      const x = this.readJSON(folderPath2 + "metadata.json");
      let i = 0;
      let json = [];
      for (i = 0; i < x.length; i++) {
        const value = x[i].fn;
        debug(folderPath2 + value);
        if (x[i].isImage) {
          const thData = await this.getThumbnailStr(folderPath2 + value);
          json.push({ b64fn: x[i].b64fn, th: thData });
          console.log(json.length);
        }
      }
      debug("all thumbnails done.......");
      await import_fs.default.writeFileSync(folderPath2 + "thumbs.json", JSON.stringify(json, null, 2), "utf8", (err) => {
        console.log({ err });
      });
    }
    return true;
  }
  async getThumbnailStr(imgPath) {
    console.log("in file1 getThumbnailStr..." + imgPath);
    try {
      const thumbnail = await (0, import_image_thumbnail.default)(
        imgPath,
        {
          percentage: 100,
          width: 200
        }
      );
      const base64Str = await thumbnail.toString("base64");
      return base64Str || "";
    } catch (err) {
      console.error(err);
      return "";
    }
  }
};

// src/index.js
var import_debug2 = __toESM(require("debug"), 1);
var debug2 = (0, import_debug2.default)("INDEX");
var fl = new FileLister();
console.log("starting server.......1");
var app = (0, import_express.default)();
app.listen(3e3, () => {
  debug2("listening on port: 3000");
});
app.use(import_express.default.static("public/"));
app.get("/url/metadata/*", f1);
app.get("/url/thumb*", f2);
app.get("/url/image/*", f3);
app.get("/url/folder/*", f4);
app.get("/url/batch/*", f5);
async function f1(req, res, next) {
  debug2("\n\n\n\nIn function f1.....");
  const b64fn = req.path.replace("/url/metadata/", "").replace("/metadata.json", "");
  const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + "/";
  debug2(b64fn, folderpath);
  if (await fl.createMetaData(folderpath) === true)
    res.sendFile(folderpath + "metadata.json");
}
async function f2(req, res, next) {
  debug2("\n\n\n\nIn function f2.....");
  const b64fn = req.path.replace("/url/thumbnails/", "").replace("/thumbs.json", "");
  const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + "/";
  debug2(b64fn, folderpath);
  if (await fl.createThumbnail(folderpath) === true)
    res.sendFile(folderpath + "thumbs.json");
}
async function f3(req, res, next) {
  debug2("In function f3.....");
  const b64fn = (req.path.replace("/url/image/", "") + "__EOL__").replace(".jpg__EOL__", "");
  console.log(b64fn);
  const parts = b64fn.split("__SLASH__");
  debug2(parts);
  const filename = Utf8Base64Converter.decodeFromBase64(parts[0]) + "/" + Utf8Base64Converter.decodeFromBase64(parts[1]);
  debug2(b64fn, filename);
  res.sendFile(filename);
}
async function f4(req, res, next) {
  debug2("In function f4.....");
  const b64fn = req.path.replace("/url/folder/", "");
  console.log(b64fn);
  if (b64fn == "zzz") {
    folderPath = "//BRESDSK-MAHMED/Data";
  } else if (b64fn == "") {
    folderPath = "//BRESDSK-MAHMED/Data/Pictures/Equations";
  } else {
    const filename = Utf8Base64Converter.decodeFromBase64(b64fn);
    folderPath = folderPath + "/" + filename;
  }
  console.log("folderPath", folderPath);
  console.log("redirecting.....");
  res.redirect("/");
}
async function f5(req, res, next) {
  debug2("\n\n\n\nIn function f5.....");
  const b64fn = req.path.replace("/url/batch/", "");
  const folderpath = Utf8Base64Converter.decodeFromBase64(b64fn) + "/";
  debug2(b64fn, folderpath);
  let x = await f6(folderpath);
}
async function f6(folderpath) {
  debug2("\n\n\n\nIn function f6....." + folderpath);
  if (await fl.createMetaData(folderpath) === true) {
    await fl.createThumbnail(folderpath);
    const x = fl.readJSON(folderpath + "metadata.json");
    for (let i = 0; i < x.length; i++) {
      if (x[i].isDir) {
        debug2(x[i].fn);
        await f6(folderpath + x[i].fn + "/");
      }
    }
  }
  return null;
}
