window.ImagesResolver = (function () {
  class ImagesResolver {
    constructor() {
      this.supportedSources = ['local', 'pixabay'];

      this.api_keys = {
        pixabay: '8593424-cd73422b571d7b174c530c89e'
      };

      this.base_url = {
        pixabay: 'https://pixabay.com/api/'
      };

      this.debouncedFetchSourse = this.debounce(this.fetchSourse, 1000);
    }

    static withdrawData(id, json) {
      const method = {
        pixabay: (data) => data.hits
      }

      return method[id](json);
    }

    debounce(func, time) {
        let timeout;
        return function(...args) {
            const context = this;

            return new Promise(function(resolve) {
                const later = function() {
                    timeout = null;
                    resolve(func.apply(context, args));
                };

                const [,,shouldAbortPrevious] = args;

                if (shouldAbortPrevious) clearTimeout(timeout);
                timeout = setTimeout(later, time);
            });
        };
    };

    fetchSourse(query, id) {
      const params = {
        pixabay: {
          key: this.api_keys[id],
          q: query,
          per_page: 200
        }
      };

      const url = new URL(this.base_url[id]);
      Object.keys(params[id])
        .forEach(key => url.searchParams.append(key, params[id][key]));

      return fetch(url)
        .then(res => res.json())
        .then(res => ImagesResolver.withdrawData(id, res));
    };

    async getSourse(query, id, isSameGallery) {
      const db = {
        local: localDB
      };

      if (!db[id]) {
        try {
          return await this.debouncedFetchSourse(query, id, isSameGallery);
        } catch(error) {
          return error;
        }
      }

      return db[id];
    }

    search(query, searchModuleId, gallery) {
      if (!this.supportedSources.includes(searchModuleId)) {
        throw new Error('Please set a search module');
      }

      const isSameGallery = this.gallery === gallery;
      this.gallery = gallery;

      const sourcePromise = this.getSourse(query, searchModuleId, isSameGallery);

      const regex = new RegExp(`(^|,\\s)${query}($|,)`, 'g');

      return sourcePromise
        .then(data => data
          .filter(item => item.tags.match(regex))
          .map(({ id, tags, previewURL: url }) => ({
            id,
            tags,
            url
          }))
          .slice(0, 100)
        )
        .then(images => ({
          query,
          images
        }));
    }
  }

  return ImagesResolver;
})();