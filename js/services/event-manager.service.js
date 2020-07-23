'use strict';

export const EventManager = (() => {

    function _getRandomInt(num1, num2) {
        var max = (num1 >= num2)? num1+1 : num2+1;
        var min = (num1 <= num2)? num1 : num2;
        return (Math.floor(Math.random()*(max - min)) + min);
    }
    function _getRandomId() {
        var pt1 = Date.now().toString(16);
        var pt2 = _getRandomInt(1000, 9999).toString(16);
        var pt3 = _getRandomInt(1000, 9999).toString(16);
        return `${pt3}-${pt1}-${pt2}`.toUpperCase();
    }

    return class EventManager {
        Events = {};
        
        constructor(isDuplicatedEvents = true, isCopyData = true) {
            this.isDuplicatedEvents = isDuplicatedEvents;
            this.isCopyData = isCopyData;
        }
    
        on = (eventName, cb) => {
            if (!this.isDuplicatedEvents) {
                this.Events[eventName] = cb;
                return;
            }
            if (!this.Events[eventName]) this.Events[eventName] = [];
            var id = _getRandomId();
            var off = () => this.off(eventName, id)
            this.Events[eventName].push({
                id,
                off,
                cb
    
            });
            return off;
        }
        
        off = (eventName, id) => {
            if (!this.isDuplicatedEvents) {
                delete this.Events[eventName];
                return;
            }
            var idx = this.Events[eventName].find(curr => curr.id === id);
            if (idx === -1) throw new Error('Something went wrong');
            this.Events[eventName].splice(idx, 1);
        }
        
        emit = (eventName, ...args) => {
            if (!this.Events[eventName]) return;
            // if (this.isCopyData){
            //     if (eventName === 'game_setted') console.log('args in socket:', args);
            //     args = JSON.parse(JSON.stringify(args));
            // }
            if (typeof(this.Events[eventName]) === 'function') return this.Events[eventName](...args);
            else this.Events[eventName].forEach(curr => curr.cb(...args));
        }
    }
})(); 