window.addEventListener("load", () => {
  function addImages(images) {
    let photoDiv = document.querySelector("#photos");
    for(var image of images) {
      var a = document.createElement("a");
      a.setAttribute("href", `/images/${image}`);
      a.setAttribute("target", "_blank");
      var img = document.createElement("img");
      img.setAttribute("src", `/images/${image}`);
      img.setAttribute("loading", "lazy");

      a.appendChild(img);
      photoDiv.appendChild(a);
    }
  }
  // a basic version of the image loader for now
  fetch(`/api/v0/images?start=0&end=10`)
    .then(resp => resp.json())
    .then(addImages);
});
