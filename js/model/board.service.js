'use strict';

import {createBoard as CreateBoard} from '../services/utils.service.js';


export default {
    createBoard,
    createBoardCell
}

const height = 30;
const width = 30;
function createBoardCell(pos) {
    if (pos.i === 0 || pos.j === 0 || pos.i === height -1 || pos.j === width-1) {
        return {type: 'WALL'};
    } else return {type: 'FLOOR', isEmty: true};
}
function createBoard() {
    return CreateBoard(height, width, createBoardCell)
}