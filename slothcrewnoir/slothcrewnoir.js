let urlBase = "https://res.cloudinary.com/slothcrew/image/upload/q_auto:low,w_auto/"
let thumbSize = (document.querySelector('.pictureContent').offsetWidth >= 301) ? 120 : 300
let thumbnailUrl = "https://res.cloudinary.com/slothcrew/image/upload/g_face,c_thumb,w_"+thumbSize +",h_" +thumbSize+"/"

fetch('https://res.cloudinary.com/slothcrew/image/list/slothcrewnoir.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
      for(resource of myJson.resources) {
        let image = document.createElement('img')
        let urlWithThumb = thumbnailUrl + resource.public_id + '.' + resource.format
        let url = urlBase + resource.public_id + '.' + resource.format
        image.src = urlWithThumb
        image.style.cursor = "pointer"
        image.addEventListener("click", function (){window.open(url,"_self")})
        document.querySelector('#pictureboard').appendChild(image)
      }
  });