'use strict';

import {evManager} from './evManager.js';

import aAlert from './cmps/alert.cmp.js';
const {Alert, Confirm, Prompt} = new aAlert();

import {TableService} from './services/table.service.js';
var tableService;

import setBtnControlsCmp from './cmps/btn-controls.cmp.js';

connectDomEvents();

function init() {
    connectEvents();
    evManager.emit('set_game');
}

function connectDomEvents() {
    document.body.onload = init;
    document.body.onkeydown = handleKey;
    document.querySelector('.restart-btn').onclick = init;
    setBtnControlsCmp(handleKey, null, 'main');
}

function connectEvents() {
    evManager.on('game_setted', ({board, bestScore}) => {
        document.querySelector('.best-score span').innerText = `${bestScore.score} - by ${bestScore.by}`;
        document.querySelector('.board-container').innerHTML = '';
        tableService = new TableService('.board-container', board, getCellHTML);
        tableService.render();
        tableService.setReSizeBoard(true);
    });
    evManager.on('cell_updated', (pos, item) => {
        tableService.updateCell(pos, item);
    });
    evManager.on('game_over', async (score, isNewBest) => {
        await Alert(`Game over..<br/><br/>Score: ${score}`);
        if (isNewBest) {
            const playerName = await Prompt('You broke the high score!<br/><br/>Save it?', 'Your name');
            if (playerName) evManager.emit('save_new_score', playerName);
        }
        var isReplay = await Confirm(`Play again?`);
        if (isReplay) {evManager.emit('set_game');}
    });
    evManager.on('score_update', score => {
        document.querySelector('.score span').innerText = score;
    })
}

function handleKey(ev) {
    const key = ev.key;
    if (['ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(key) && ev.preventDefault) {
        ev.preventDefault();
    }
    if (key === 'ArrowUp') return evManager.emit('change_direction', 'UP');
    if (key === 'ArrowDown') return evManager.emit('change_direction', 'DOWN');
    if (key === 'ArrowRight') return evManager.emit('change_direction', 'RIGHT');
    if (key === 'ArrowLeft') return evManager.emit('change_direction', 'LEFT');
    if (key === 'Escape') return pauseGame();
}

async function pauseGame() {
    evManager.emit('pause_game');
    await Alert('Game paused');
    evManager.emit('resurme_game');
}


function getCellHTML(pos, item) {
    var content = '';
    // content = item.part? item.part.charAt(0) : '';
    var direction = (() => {
        if (item.faceDirection === 'UP') return 0;
        if (item.faceDirection === 'RIGHT') return 90;
        if (item.faceDirection === 'DOWN') return 180;
        if (item.faceDirection === 'LEFT') return 270;
        return 0;
    })();
    var className = item.type.toLowerCase();
    return `<div class="${className} flex-center" style="transform:rotate(${direction}deg);height:100%;width:100%;">
                ${content}
            </div>`;
}