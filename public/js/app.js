window.addEventListener("load", () => {
  function addImages(images) {
    let photoDiv = document.querySelector("#photos");
    for(var image of images) {
      let a = document.createElement("a");
      a.setAttribute("href", `/images/full/${image}`);
      a.setAttribute("target", "_blank");
      a.setAttribute("style", `background-image: url("images/thumbnails/${image}")`);
      a.classList.add("loading");
      
      let img = document.createElement("img");
      img.setAttribute("src", `/images/full/${image}`);
      img.setAttribute("loading", "lazy");

      if(img.complete) {
        img.parentElement.classList.remove("loading");
      } else {
        img.addEventListener("load", (evt) => {
          evt.currentTarget.parentElement.classList.remove("loading")
        });
      }

      a.appendChild(img);
      photoDiv.appendChild(a);
    }
  }
  // a basic version of the image loader for now
  fetch(`/api/v0/images?start=0&end=10`)
    .then(resp => resp.json())
    .then(addImages);
});
