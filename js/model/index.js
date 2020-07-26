'use strict';

import {evManager} from '../evManager.js';

// import {createBoard} from '../services/utils.service.js';
import boardService from './board.service.js';
import playerService from './player.service.js';
import { getRandomInt } from '../services/utils.service.js';

import scoreService from './score.service.js';

var gState;
function setState() {
    var board = boardService.createBoard();
    var playerParts = playerService.setPlayer(board);
    return {
        board,
        playerParts,
        playerInterval: null,
        moveDirection: 'RIGHT',
        directionToSet: 'RIGHT',
        foodInterval: null,
        score: 0,
        bestScore: scoreService.loadScore(),
        isOn: false,
        isSuperMode: false,
        superModeTimeout: null,
        // isPaused: false
    }
}

evManager.on('set_game', (isToStart) => {
    if (gState) pauseGame();
    gState = setState();
    window.gState = gState;
    evManager.emit('game_setted', {board:gState.board, bestScore: gState.bestScore});
    evManager.emit('score_update', 0);
    if (isToStart) startGame();
});
evManager.on('pause_game', () => {
    pauseGame(true);
});
evManager.on('resurme_game', startGame);
evManager.on('change_direction', direction => {
    gState.directionToSet = direction;
});
evManager.on('save_new_score', byPlayerName => {
    scoreService.saveScore(gState.score, byPlayerName);
});

function startGame() {
    if (!gState || gState.isOn) return;
    gState.playerInterval = setInterval(() => {
        var direction = gState.directionToSet;
        if (!(direction === 'UP' && gState.moveDirection === 'DOWN') &&
            !(direction === 'DOWN' && gState.moveDirection === 'UP') &&
            !(direction === 'RIGHT' && gState.moveDirection === 'LEFT') &&
            !(direction === 'LEFT' && gState.moveDirection === 'RIGHT')) {
                gState.moveDirection = direction;
            }
        try{playerService.movePlayer(gState);}
        catch(e){endGame();}
    }, 100);
    gState.foodInterval = setInterval(spreadFood, 5000);
    spreadFood();
    gState.isOn = true;
}
function pauseGame(isToEmit) {
    if (!gState || !gState.isOn) return;
    clearInterval(gState.playerInterval);
    clearInterval(gState.foodInterval);
    gState.isOn = false;
    if (isToEmit) evManager.emit('game_paused');
}

function endGame() {
    pauseGame();
    var isNewScore = scoreService.checkIfNewBestScore(gState.score);
    evManager.emit('game_over', gState.score, isNewScore);
    gState.isOn = false;
}

function spreadFood() {
    const board = gState.board;
    var empties = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var item = board[i][j];
            if (item.type === 'FLOOR') empties.push({i,j});
        }
    }
    if (!empties.length) return;
    var idx = getRandomInt(0, empties.length-1);
    var pos = empties[idx];

    var food = {type: 'FOOD', score: 1};
    if (Math.random() > 0.9) {
        food = {
            type: 'FOOD',
            subtype: 'SUPER',
            score: 10,
            operation: () => {
                if (gState.superModeTimeout) clearTimeout(gState.superModeTimeout);
                gState.isSuperMode = true;
                evManager.emit('supermode_on');
                gState.superModeTimeout = setTimeout(() => {
                    gState.isSuperMode = false;
                    evManager.emit('supermode_off');
                }, 8000);
            }
        }
    }
    
    board[pos.i][pos.j] = food;
    evManager.emit('cell_updated', pos, food);
}