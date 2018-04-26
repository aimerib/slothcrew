let urlBase = "https://res.cloudinary.com/slothcrew/image/upload/q_auto:low,w_auto/"

fetch('https://res.cloudinary.com/slothcrew/image/list/slothcrewnoir.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
      console.log(myJson.resources.length)
      for(resource of myJson.resources) {
        let image = document.createElement('img')
        let url = urlBase + resource.public_id + '.' + resource.format
        image.src = url
        document.querySelector('#pictureboard').appendChild(image)
      }
      //let url = urlBase + myJson.resources[0].public_id + '.' + myJson.resources[0].format
    //document.querySelector('#pictureboard').innerHTML = "<img src=" + url + "></a>"
  });