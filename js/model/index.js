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
        bestScore: scoreService.loadScore()
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
    pauseGame();
});
evManager.on('resurme_game', startGame);
evManager.on('change_direction', direction => {
    gState.directionToSet = direction;
});
evManager.on('save_new_score', byPlayerName => {
    scoreService.saveScore(gState.score, byPlayerName);
});

function startGame() {
    gState.playerInterval = setInterval(() => {
        var direction = gState.directionToSet;
        if (!(direction === 'UP' && gState.moveDirection === 'DOWN') &&
            !(direction === 'DOWN' && gState.moveDirection === 'UP') &&
            !(direction === 'RIGHT' && gState.moveDirection === 'LEFT') &&
            !(direction === 'LEFT' && gState.moveDirection === 'RIGHT')) {
                gState.moveDirection = direction;
            }
        // var res = playerService.movePlayer(gState);
        // if (res === 'GAME_OVER') endGame(false);
        try{playerService.movePlayer(gState);}
        catch(e){endGame();}
    }, 100);
    gState.foodInterval = setInterval(spreadFood, 5000);
    spreadFood();
}
function pauseGame() {
    clearInterval(gState.playerInterval);
    clearInterval(gState.foodInterval);
}

function endGame() {
    pauseGame();
    var isNewScore = scoreService.checkIfNewBestScore(gState.score);
    evManager.emit('game_over', gState.score, isNewScore);
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
    board[pos.i][pos.j] = food;
    evManager.emit('cell_updated', pos, food);
}