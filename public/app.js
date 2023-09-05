(() => {
  // src/index.js
  console.log("starting client.......");
  var view = "<H1>Hello World!....123</H1>";
  var divMain = document.getElementById("divMain");
  if (divMain) {
    divMain.innerHTML = view;
  }
})();
