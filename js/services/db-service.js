'use strict';



export const DbService = (() => {
    // utils!!
    function _storeToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value)|| null);
    }
    function _loadFromStorage(key) {
        let data = localStorage.getItem(key);
        return (data) ? JSON.parse(data) : undefined;
    }
    function _getRandomId() {
        var pt1 = Date.now().toString(16);
        var pt2 = _getRandomInt(1000, 9999).toString(16);
        var pt3 = _getRandomInt(1000, 9999).toString(16);
        return `${pt3}-${pt1}-${pt2}`.toUpperCase();
    }
    function _getRandomInt(num1, num2) {
        var max = (num1 >= num2)? num1+1 : num2+1;
        var min = (num1 <= num2)? num1 : num2;
        return (Math.floor(Math.random()*(max - min)) + min);
    }

    return class DbService {
        constructor(collectionName, idFuild = '_id', loadFunc = _loadFromStorage, storeFunc = _storeToStorage) {
            this.collectionName = collectionName;
            this.idFuild = idFuild;
            this.loadFunc = loadFunc;
            this.storeFunc = storeFunc;
        }
    
        query() {
            var collection = this.loadFunc(this.collectionName);
            if (!collection) collection = [];
            return Promise.resolve(collection);
        }
    
        async get(id) {
            var collection = await this.query();
            return collection.find(curr => curr[this.idFuild] === id);
        }
    
        async remove(id) {
            var collection = await this.query();
            var idx = collection.findIndex(curr => curr[this.idFuild] === id);
            if (idx === -1) throw new Error('something went wrong');
            collection.splice(idx, 1);
            this.storeFunc(this.collectionName, collection);
            return Promise.resolve();
        }
    
        async save(item) {
            var collection = await this.query();
    
            if (item[this.idFuild]) {
                let idx = collection.findIndex(curr => curr[this.idFuild] === item[this.idFuild]);
                if (idx === -1) throw new Error('something went wrong');
                collection[idx] = item;
            } else {
                item[this.idFuild] = _getRandomId();
                collection.push(item);
            }
    
            this.storeFunc(this.collectionName, collection);
            return Promise.resolve(item);
        }
    
        async insert(items) {
            var collection = await this.query();
            items.forEach(curr => curr[this.idFuild] = _getRandomId());
            collection.push(...items);
            
            this.storeFunc(this.collectionName, collection);
            return Promise.resolve();
        }
    }
})();