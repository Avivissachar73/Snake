'use strict';

import {evManager} from '../evManager.js';
import boardService from './board.service.js';

export default {
    setPlayer,
    movePlayer
}


function setPlayer(board) {
    var playerParts = [
        createPlayerPart('HEAD', 'RIGHT', {i:15,j:15}),
        createPlayerPart('BODY', 'RIGHT', {i:15,j:14}),
        createPlayerPart('TAIL', 'RIGHT', {i:15,j:13}),
    ];
    playerParts.forEach(curr => {
        let pos = curr.pos;
        board[pos.i][pos.j] = curr;
    });
    return playerParts;
}


function movePlayer(state) {
    var {playerParts, board} = state;
    var moveDiff = getMoveDiff(state.moveDirection);
    var firstPart = playerParts[0];
    var lastPart = playerParts[playerParts.length-1];
    var beforelast = playerParts[playerParts.length-2];
    var targetPos = getTargetPos(firstPart.pos, moveDiff, state);
    var targetCell = board[targetPos.i][targetPos.j];
    if (targetCell.type === 'WALL' || targetCell.type === 'PLAYER') {
        throw new Error('invalid move');
    }
    if (targetCell.type === 'FOOD') {
        var newPart = createPlayerPart('HEAD', state.moveDirection, targetPos);
        firstPart.part = 'BODY';
        firstPart = newPart;
        playerParts.push(newPart);
        board[targetPos.i][targetPos.j] = newPart;
        state.score += targetCell.score;
        evManager.emit('score_update', state.score);
        if (targetCell.operation) targetCell.operation();
    }
    var LastPrevPos = lastPart.pos;
    lastPart.faceDirection = state.moveDirection;
    lastPart.pos = targetPos;
    lastPart.part = 'HEAD';
    beforelast.part = 'TAIL';
    firstPart.part = 'BODY';
    var item = playerParts.pop();
    playerParts.unshift(item);
    board[LastPrevPos.i][LastPrevPos.j] = boardService.createBoardCell(LastPrevPos);
    board[targetPos.i][targetPos.j] = lastPart;

    evManager.emit('cell_updated', LastPrevPos, board[LastPrevPos.i][LastPrevPos.j]);
    evManager.emit('cell_updated', lastPart.pos, lastPart);
    evManager.emit('cell_updated', beforelast.pos, beforelast);
    evManager.emit('cell_updated', firstPart.pos, firstPart);
}

function getMoveDiff(moveDirection) {
    switch (moveDirection) {
        case 'UP': return {i:-1,j:0};
        case 'DOWN': return {i:1,j:0};
        case 'RIGHT': return {i:0,j:1};
        case 'LEFT': return {i:0,j:-1};
    }
}


function createPlayerPart(part = 'BODY', faceDirection = 'RIGHT', pos) {
    return {
        type: 'PLAYER', 
        part, 
        faceDirection, 
        pos
    }
}

function getTargetPos(pos, moveDiff, state) {
    var i = pos.i + moveDiff.i;
    var j = pos.j + moveDiff.j;
    if (state.isSuperMode) {
        let board = state.board;
        let isOnI = moveDiff.i !== 0;
        if (isOnI) {
            if (i === 0) i = board.length-2;
            else if (i === board.length-1) i = 1;
        } else {
            if (j === 0) j = board[0].length-2;
            else if (j === board[0].length-1) j = 1;
        }
    }
    return {i, j};
}