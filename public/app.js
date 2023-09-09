(() => {
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
      const jsonData = await fetchDataFromUrl("url");
      console.log("Fetched data:", jsonData);
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
})();
