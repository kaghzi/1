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
        const jsonData = await fetchDataFromUrl("url");
        // Use the fetched JSON data here
        console.log('Fetched data:', jsonData);
      } catch (error) {
        // Handle errors here
        console.error('Error:', error);
      }
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