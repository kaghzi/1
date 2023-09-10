export default class imageUtils {    
    jsonData;

    constructor(jsonData){
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
      console.log('In showImageFullscreen..........', i);
      const b64fn = this.jsonData[i].b64fn;
      console.log(b64fn);
      const imageUrl = "/url/image/"+b64fn + '.jpg';

      // Create a div element to hold the image
      const fullscreenDiv = document.createElement('div');
      fullscreenDiv.style.position = 'fixed';
      fullscreenDiv.style.top = '0';
      fullscreenDiv.style.left = '0';
      fullscreenDiv.style.width = '100%';
      fullscreenDiv.style.height = '100%';
      fullscreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Optional: Background color for the overlay
    
      // Create an image element and set its source
      const img = new Image();
      img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
      img.style.objectFit = 'contain'; // Maintain image aspect ratio
    
      // Add the image to the div
      fullscreenDiv.appendChild(img);
    
      // Append the div to the document body
      document.body.appendChild(fullscreenDiv);
    
      // Toggle fullscreen on div click
      fullscreenDiv.addEventListener('click', this.clickHandler);
      fullscreenDiv.addEventListener('keypress', this.keypressHandler);
    }

    clickHandler(e) {
      console.log('In clickHandler..........',e);
      console.log(e.target.parentElement);
      const fullscreenDiv = e.target.parentElement
      if (document.fullscreenElement) {
        document.exitFullscreen();
        fullscreenDiv.remove();
      } else {
        fullscreenDiv.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      }
  }

  keypressHandler(e) {
      console.log('In keypressHandler..........');
      const img = e.target
      if (!document.fullscreenElement) {
        img.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      } else {
        document.exitFullscreen();
        img.remove();
      }
  }
}