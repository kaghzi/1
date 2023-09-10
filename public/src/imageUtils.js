export default class imageUtils {     

    static imgClick(e) {
      const img = e.target;
      const b64fn = img["data-b64fn"];
      console.log(b64fn);

      const imageUrl = "/url/image/"+b64fn + '?path=ttt';
      const iu=new imageUtils();
      iu.showImageFullscreen(imageUrl);
    }

    showImageFullscreen(imageUrl) {
      // Create an image element
      const img = new Image();
      img.src = imageUrl;
    
      // Style the image for fullscreen display
      img.style.position = 'fixed';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.backgroundColor = 'black'; // Optional: set background color
    
      // Add a click event listener to toggle fullscreen
      img.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          img.requestFullscreen().catch((err) => {
            console.error('Error attempting to enable full-screen mode:', err);
          });
        } else {
          document.exitFullscreen();
          img.remove();
        }
      });

      // Append the image to the document body
      document.body.appendChild(img);
    }
}