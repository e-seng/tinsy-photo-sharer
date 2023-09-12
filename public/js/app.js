window.addEventListener("load", () => {
  // close the dialog if it is directly clicked
  let dialog = document.querySelector("dialog");
  dialog.addEventListener("click", (evt) => {
    if(evt.target.nodeName !== "DIALOG") return;
    console.log("clicked", evt.target);
    dialog.querySelector("div").classList.remove("loaded");
    dialog.querySelector("img").setAttribute("src", "");
    dialog.close('');
  });

  let offset = 0;
  let loadCount = 10;
  let loading = false;

  let observer = new IntersectionObserver(() => {
    loadImage(offset);
  });

  //
  let screenChecker = setInterval(() => {
    observer.observe(document.querySelector("footer"));
  }, 100); // */

  function viewImage(image, target) {
    let dialogDiv = dialog.querySelector("div");
    dialogDiv.setAttribute("style", `background-image: url("/images/thumbnails/${image}");`);

    let img = dialog.querySelector("img");
    img.setAttribute("src", `/images/full/${image}`);

    if(img.complete) {
      img.parentElement.classList.add("loaded");
    } else {
      img.addEventListener("load", (evt) => {
        evt.currentTarget.parentElement.classList.add("loaded")
      });
    }

    dialog.showModal();
  }

  function addImages(images) {
    if(images.length === 0) {
      clearInterval(screenChecker);
      observer.unobserve(document.querySelector("footer"));
    }
    offset += images.length;

    let photoDiv = document.querySelector("#photos");
    for(var image of images) {
      let a = document.createElement("a");
      a.setAttribute("href", `/images/full/${image}`);
      a.setAttribute("value-img", image);
      a.setAttribute("target", "_blank");
      a.setAttribute("style", `background-image: url("/images/thumbnails/${image}")`);
      a.setAttribute("loading", "lazy");
      a.classList.add("loading");
      
      let img = document.createElement("img");
      img.setAttribute("src", `/images/preview/${image}`);
      img.setAttribute("loading", "lazy");

      if(img.complete) {
        img.parentElement.classList.remove("loading");
      } else {
        img.addEventListener("load", (evt) => {
          evt.currentTarget.parentElement.classList.remove("loading")
        });
      }

      a.addEventListener("click", (evt) => {
        evt.preventDefault();
        viewImage(a.getAttribute("value-img"), evt.target);
      });

      a.appendChild(img);
      photoDiv.appendChild(a);
    }
  }

  function loadImage(offset) {
    // crappy mutex :)
    if(loading) return;
    loading = true;
    fetch(`/api/v0/images?start=${offset}&end=${offset+loadCount}`)
      .then(resp => {
        loading = false;
        return resp.json()
      })
      .then(addImages);
  }
});
