"use strict";

import map from "lodash/map"

export default class SearchBookmarkService {
    constructor(CacheFactory, $state, $stateParams) {
        'ngInject';

        this.$state = $state;
        this.$stateParams = $stateParams;


        this.storage = CacheFactory.get('case_search');
        if(!this.storage) {
            this.storage = CacheFactory('case_search', {
                storageMode: 'localStorage'
            });
        }
    }

    getAllBookmarks() {
        return map(this.storage.keys(), key => this.getBookmark(key));
    }

    getBookmark(id) {
        return this.storage.get(id);
    }

    getCurrentBookmark() {
        const {$state, $stateParams} = this;

        if($state.current.name == "advancedSearch" && $stateParams.bookmark != null) return this.getBookmark($stateParams.bookmark);

        return null;
    }

    saveBookmark(bookmark) {
        const existingBookmark = this.getBookmark(bookmark.id);
        if(existingBookmark) this.deleteBookmark(bookmark.id);

        this.storage.put(bookmark.id, bookmark);
    }

    deleteBookmark(id) {
        this.storage.remove(id);
    }
};
