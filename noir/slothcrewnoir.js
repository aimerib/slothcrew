let urlBase = "https://res.cloudinary.com/slothcrew/image/upload/q_auto:low,w_auto/"
let thumbSize = (document.querySelector('.pictureContent').offsetWidth >= 301) ? 120 : 300
let thumbnailUrl = "https://res.cloudinary.com/slothcrew/image/upload/g_face,c_thumb,w_"+thumbSize +",h_" +thumbSize+"/"

fetch('https://res.cloudinary.com/slothcrew/image/list/slothcrewnoir.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
      for(resource of myJson.resources) {
        let linkForModal = document.createElement('a')
        let image = document.createElement('img')
        let urlWithThumb = thumbnailUrl + resource.public_id + '.' + resource.format
        let url = urlBase + resource.public_id + '.' + resource.format
        linkForModal.href = "#modal1"
        linkForModal.classList.add("modal-trigger")
        image.src = urlWithThumb
        //image.classList.add("modal-trigger")
        image.style.cursor = "pointer"
        linkForModal.appendChild(image)
        image.addEventListener("click", function (ev){changeModal(url)})
        document.querySelector('#pictureboard').appendChild(linkForModal)
      }
  });

  function changeModal(url) {

    document.querySelector("#fullImage").src = url
    document.querySelector("#cloudinaryImage").href = url
  }