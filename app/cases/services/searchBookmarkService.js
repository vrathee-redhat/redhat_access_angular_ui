"use strict";

import map from "lodash/map"

export default class SearchBookmarkService {
    constructor(CacheFactory) {
        'ngInject';


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

    saveBookmark(bookmark) {
        const existingBookmark = this.getBookmark(bookmark.id);
        if(existingBookmark) this.deleteBookmark(bookmark.id);

        this.storage.put(bookmark.id, bookmark);
    }

    deleteBookmark(id) {
        this.storage.remove(id);
    }
};
