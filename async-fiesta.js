
$(() => {
  const $bucket = $('.photo-bucket');
  const draw = img => {
    $bucket.append(img);
    $(img).wrap(`<div class="product-card"></div>`); //wrapping in an outer div for better/more logical styling
    $(img).after(`<div class="product-info"><p class="time-posted">1 min ago</p><p class="brand-name">Fear of Jerry</p><p class="size">M</p><p class="item-desc">Oversized striped tee</p><p class="price">$240</p></div>`);

  }
  avanti = true; //means "onward" in italian ;)
  let images = IMAGE_IDS;
  let promises = [];
  // NOTE: The height and width variables can be changed to fetch different sized images.
  const getImageUrl = id => `https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/cache=expiry:max/rotate=deg:exif/rotate=deg:0/resize=width:200,height:250,fit:crop/output=format:jpg,quality:95/compress/${id}`;

  const startLoading = () => {
    let userStop = !avanti; //We want userstop to be true if and only if the last button clicked was Stop Loading
    if(!userStop){ //if userStop is false, we start loading
      console.log('Loading images!');
      let batch = images.splice(0,5).map(getImageUrl); //we just want five at a time, and we want to mutate the images array as we go along
      if (images.length){ //if there are still any images left to draw...
        for (let i=0; i<batch.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            let img = new Image();
            img.src = batch[i];
            img.onload = () => { //if image loaded successfully, let's append it
              resolve(draw(img));
            };
            img.onerror = () => {
              reject(img);
            };
          }));
        } //end of for loop
      Promise.all(promises) //now we resolve all the mini promises in one big promise
        .then(() => setTimeout(startLoading,3000)) //it's recursive!
        .catch((error) => console.log('error: ', error));
      }else{
        console.log('Success!'); //all images have loaded (none left to load)
        return;
      } 
    } avanti = true;
      return;
  }
      
    

  const stopLoading = () => {
    clearTimeout(startLoading); //otherwise we'll keep recursing through startLoading!
    console.log("Pausing image load");
    avanti = false;
  }
  

  $('button.start').on('click', startLoading);
  $('button.stop').on('click', stopLoading);

});
