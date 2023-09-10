export default class imageUtils {    
    jsonData;
    currentIndex;
    keyDownListener;
    b64currentpath;

    constructor(jsonData, b64currentpath){
      this.jsonData = jsonData;
      this.b64currentpath = b64currentpath
    }

    showImageFullscreen(i) {
      console.log('In showImageFullscreen..........', i);
      this.currentIndex=i;
      const b64fn = this.jsonData[i].b64fn;
      console.log(b64fn);
      const imageUrl = "/url/image/" + this.b64currentpath + '__SLASH__' + b64fn + '.jpg';

      // Create a div element to hold the image
      const fullscreenDiv = document.createElement('div');
      fullscreenDiv.id = 'fullscreenDiv';
      fullscreenDiv.style.position = 'fixed';
      fullscreenDiv.style.top = '0';
      fullscreenDiv.style.left = '0';
      fullscreenDiv.style.width = '100%';
      fullscreenDiv.style.height = '100%';
      fullscreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Optional: Background color for the overlay
    
      // Create an image element and set its source
      const img = new Image();
      img.id = 'imgFullScreen';
      img.src = imageUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain'; // Maintain image aspect ratio
    
      // Add the image to the div
      fullscreenDiv.appendChild(img);
    
      // Append the div to the document body
      document.body.appendChild(fullscreenDiv);
    
      // Toggle fullscreen on div click
      fullscreenDiv.addEventListener('dblclick', () => {this.toggleFullscreen(fullscreenDiv);});

      this.keyDownListener = (e) => {this.keypressHandler(e, fullscreenDiv);};
      document.addEventListener('keydown', this.keyDownListener);
    }

    clickHandler(e) {
      console.log('In clickHandler..........',e);
      console.log(e.target.parentElement);
      const fullscreenDiv = e.target
      if (document.fullscreenElement) {
        document.exitFullscreen();
        e.target.remove();
      } else {
        fullscreenDiv.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      }

      console.log(document.activeElement);
    }

    keypressHandler(e, fullscreenDiv) {
        console.log('In keypressHandler..........',e);
        if (e.key === 'Escape') {
          if (document.fullscreenElement) document.exitFullscreen();          
          document.removeEventListener('keydown', this.keyDownListener);
          fullscreenDiv.remove();
        }
        
        if (e.key === 'ArrowRight') {
          this.showNextImage();
        }
        if (e.key === 'ArrowLeft') {
          this.showPrevImage();
        }
    }

    showNextImage()
    {
      console.log('In .............showNextImage', this.currentIndex);
      if((this.currentIndex + 1) < this.jsonData.length){
          this.currentIndex++;
          const imgFullScreen = document.getElementById('imgFullScreen');

          
          const b64fn = this.jsonData[this.currentIndex].b64fn;
          console.log(b64fn);
          const imageUrl = "/url/image/" + this.b64currentpath + '__SLASH__' + b64fn + '.jpg';

          imgFullScreen.src = imageUrl;
      }

    }
    
    showPrevImage()
    {
      console.log('In .............showPrevImage', this.currentIndex);
      if(this.currentIndex > 0)
      {
        this.currentIndex--;
        const imgFullScreen = document.getElementById('imgFullScreen');

        
        const b64fn = this.jsonData[this.currentIndex].b64fn;
        console.log(b64fn);
        const imageUrl = "/url/image/" + this.b64currentpath + '__SLASH__' + b64fn + '.jpg';

        imgFullScreen.src = imageUrl;
      }

    }
  
  // Function to enter fullscreen
  toggleFullscreen(element) {
    if (document.fullscreenElement) {
      if (document.fullscreenElement === element) document.exitFullscreen();
    } else {
      element.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable full-screen mode:', err);
      });
    }
  }
}