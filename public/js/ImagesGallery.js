window.ImageGallery = (function () {
  class ImageGallery {
    /**
     * @constructor
     * @param {ImagesResolver} imagesResolver
     */
    constructor(imagesResolver) {
      this.imagesResolver = imagesResolver;
      this._initView();
      this._initViewFunctionality();
      this.galleryId = KeyGenerator.getNext();
    }

    /**
     * @param {String} query
     */
    search(query, searchModuleId) {
      const searchResults = this.imagesResolver.search(query, searchModuleId, this.galleryId);
      searchResults.then(result => this._onReceiveSearchResult(result))
    }

    addToElement(element) {
      element.appendChild(this.container);
    }

    _onUserSearch(ev) {
      ev.preventDefault();
      this.search(this.seachInput.value, this.sourceSelect.value);
    }

    _onReceiveSearchResult(result) {
      this.searchResults.innerHTML = "";
      const imagesInfo = result.images;

      imagesInfo.forEach((image) => {
        const imgNode = document.createElement('img');
        imgNode.setAttribute('src', image.url);
        this.searchResults.appendChild(imgNode);
      });
    }

    _initView() {
      this.container = document.createElement("div");
      this.container.className = "gallery";

      this.form = document.createElement("form");
      this.form.className = "gallery__form form-inline";
      this.container.appendChild(this.form);

      this.formGroup = document.createElement("div");
      this.formGroup.className = "form-group";
      this.form.appendChild(this.formGroup);

      this.seachInput = document.createElement("input");
      this.seachInput.className = "gallery__search form-control";
      this.seachInput.placeholder = "search by tag";
      this.formGroup.appendChild(this.seachInput);

      this.sourceSelect = document.createElement("select");
      this.sourceSelect.className = "gallery__source form-control";
      this.sourceSelect.placeholder = "select a search module";
      this.formGroup.appendChild(this.sourceSelect);
      ['local', 'pixabay'].forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.text = item;
        this.sourceSelect.appendChild(option);
      })

      this.searchButton = document.createElement("button");
      this.searchButton.className = "gallery__button btn btn-primary";
      this.searchButton.innerText = "search";
      this.form.appendChild(this.searchButton);

      this.searchResults = document.createElement("div");
      this.searchResults.className = "gallery__result";
      this.container.appendChild(this.searchResults);
    }

    _initViewFunctionality() {
      this.form.addEventListener("submit", this._onUserSearch.bind(this));
    }
  }

  return ImageGallery;
})();