'use strict';

export const Utils = {
    getQuerysStr,
    storeToSession,
    loadFromSession,
    storeToStorage,
    loadFromStorage,
    getRandomId,
    getRandomInt,
    copy,
    getRandomColor,
    stringToLowerKabab,
    getStyleStr,
    deepSearch
};


///////////////EXPORTED_FUNCTIONS///////////////
///////////////EXPORTED_FUNCTIONS///////////////
///////////////EXPORTED_FUNCTIONS///////////////


export function getQuerysStr(filterBy = {}) {
    var queryStr = '?';
    for (let key in filterBy) {
        let val = (typeof(filterBy[key]) === 'object')? 
                            JSON.stringify(filterBy[key]) : 
                            filterBy[key];
        queryStr += `${key}=${val}&`;
    }
    return queryStr.slice(0, queryStr.length-1);
} 

export function getQuerysStr2(criteria = {}) {
    var queryStr = '?';
    var criteriaJson = JSON.stringify(criteria);
    queryStr += criteriaJson.substring(2, criteriaJson.length-2);
    queryStr = queryStr.split('":"').join('=')
                       .split('","').join('&');
    return queryStr;
} 

export function getRandomId() {
    var pt1 = Date.now().toString(16);
    var pt2 = getRandomInt(1000, 9999).toString(16);
    var pt3 = getRandomInt(1000, 9999).toString(16);
    return `${pt3}-${pt1}-${pt2}`.toUpperCase();
}

export function getRandomInt(num1, num2) {
    var max = (num1 >= num2)? num1+1 : num2+1;
    var min = (num1 <= num2)? num1 : num2;
    return (Math.floor(Math.random()*(max - min)) + min);
}

export function copy(obj) {
    if (typeof(obj) !== 'object') return obj;
    var copied = (Array.isArray(obj))? [...obj] : {...obj};
    var keys = Object.keys(obj);
    for (let key of keys) {
        if (!isNaN(+key)) key = +key;
        if (copied[key] instanceof HTMLElement) continue;
        copied[key] = copy(copied[key]);
    }
    return copied;
}

export function watchOnObj(obj, cbFunc, basePath = '') {
    if (!obj || typeof(obj) !== 'object') return;
    let keys = Object.keys(obj);
    for (let key of keys) {
        let isCall = false;
        let path = basePath;
        path += path.length ? `.${key}` : key;
        let initialVal = obj[key];
        let fuildName = key;
        Object.defineProperty(obj, key, {
            set: function(val) {
                let oldVal = key;
                key = val;
                if (isCall) cbFunc(val, oldVal, path);
            },
            get: function() {
                return key;
            }
        });
        obj[fuildName] = initialVal;
        isCall = true;
        if (typeof(obj[fuildName]) === 'object' && !Array.isArray(obj[fuildName]) && obj[fuildName]) watchOnObj(obj[fuildName], cbFunc, path);
    }
}

export function range(length, startFrom = 0) {
    var arrToReturn = [];
    for (let i = startFrom; i < length; i++) {
        arrToReturn.push(i);
    }
    return arrToReturn;
}

export function getRandomColor(isOpacity) {
    const options = '0123456789ABCDEF';
    const length = isOpacity ? 8 : 6;
    var color = '#';
    for (let i = 0; i < length; i++) color += options[getRandomInt(0, options.length-1)];
    return color;
}

export function stringToLowerKabab(str) {
    const letterMap = {
        'a': 'A',
        'b': 'B',
        'c': 'C',
        'd': 'D',
        'e': 'E',
        'f': 'F',
        'g': 'G',
        'h': 'H',
        'i': 'I',
        'j': 'J',
        'k': 'K',
        'l': 'L',
        'm': 'M',
        'n': 'N',
        'o': 'O',
        'p': 'P',
        'q': 'Q',
        'r': 'R',
        's': 'S',
        't': 'T',
        'u': 'U',
        'v': 'V',
        'w': 'W',
        'x': 'X',
        'y': 'Y',
        'z': 'Z',
    }
    const letterVals = Object.values(letterMap);
    let fixedStr = '';
    for (let i = 0; i < str.length; i++) {
        let curr = str[i];
        let lowerCurr = curr.toLowerCase();
        if (letterVals.includes(curr)) {
            if (i === 0) fixedStr += lowerCurr;
            else if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
        } else fixedStr += lowerCurr;
    }
    return fixedStr;
}

export function getStyleStr(style = {}) {
    var str = '';
    for (let key in style) {
        str += `${stringToLowerKabab(key)}:${style[key]};`;
    }
    return str;
} 

export function deepSearch(val, searchVal, isIgnoreCase = true, isIncluded = true) {
    if (val === searchVal) return true;
    if (typeof(val) === 'object') {
        for (let key in val) {
            let curr = val[key];
            if (curr === searchVal) return true;
            else if (typeof(curr) === 'string' && typeof(searchVal) === 'string') {
                if (isIgnoreCase) {
                    let lowerSearchVal = searchVal.toLowerCase();
                    if (isIncluded && curr.toLowerCase().includes(lowerSearchVal)) return true;
                    else if (!isIncluded && curr.toLowerCase() === lowerSearchVal) return true;
                }
                else if (isIncluded && curr.includes(searchVal)) return true;
            }
            else if (deepSearch(curr, searchVal, isIgnoreCase)) return true;
        }
    }
    return false;
}

export function createBoard(height = 30, width = 30, createCell = (pos) => `${pos.i}-${pos.j}`) {
    var board = [];
    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++) {
            board[i][j] = createCell({i,j});
        }
    }
    return board;
}

//////////////////STORAGE_SERVICE////////////////////
//////////////////STORAGE_SERVICE////////////////////
//////////////////STORAGE_SERVICE////////////////////

export function storeToSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value || null));
}
export function loadFromSession(key) {
    var data = sessionStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}


export function storeToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value)|| null);
}
export function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}

///////////////PROTOTYPES///////////////
///////////////PROTOTYPES///////////////
///////////////PROTOTYPES///////////////

export function setPrototypes() {
    Array.prototype.random = function(startIdx = 0, endIdx = this.length-1) {
        return this[getRandomInt(startIdx, endIdx)]
    }
    Array.prototype.shuffle = function() {
        var copy = this.slice();
        var shuffled = [];
        for (let i = 0; i < this.length; i++) {
            shuffled.push(copy.splice(getRandomInt(0, copy.length-1), 1)[0]);
        }
        return shuffled;
    }

    String.prototype.random = function(startIdx = 0, endIdx = this.length-1) {
        return this[getRandomInt(startIdx, endIdx)]
    }
    String.prototype.shuffle = function() {
        var copy = this.split('');
        var shuffled = [];
        for (let i = 0; i < this.length; i++) {
            shuffled.push(copy.splice(getRandomInt(0, copy.length-1), 1)[0]);
        }
        return shuffled.join('');
    }
    String.prototype.multiReplace = function(searchValue, replaceValue) {
        replaceValue += '';
        var str = this;
        var counter = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === searchValue[counter]) counter++;
            else counter = 0;
            if (counter === searchValue.length) {
                str = str.substring(0, i-counter+1)+replaceValue+str.substring(i+1);
                counter = 0;
                i -= (searchValue.length-replaceValue.length);
            }
        }
        return str;
    }
    JSON.require = require;
}

function require(path, isAsync = false) {
    var XmlReq = new XMLHttpRequest();
    XmlReq.overrideMimeType('application/json');
    XmlReq.open('GET', path, isAsync);
    const checkSuccess = () => (XmlReq.readyState === XMLHttpRequest.DONE && XmlReq.status === 200);
    const checkFailior = () => (XmlReq.readyState === XMLHttpRequest.DONE && XmlReq.status !== 200);
    const ErrorMsg = `could not load from path: ${path}`;
    if (isAsync) {
        return new Promise((resolve, reject) => {
            XmlReq.onreadystatechange = () => {
                if (checkSuccess()) resolve(JSON.parse(XmlReq.responseText));
                else if (checkFailior()) reject(ErrorMsg);
            }
            XmlReq.send(null);
        });
    } 
    XmlReq.send(null);
    if (checkSuccess()) return JSON.parse(XmlReq.responseText);
    else if (checkFailior()) throw new Error(ErrorMsg);
}