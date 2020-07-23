'use strict';

import {storeToStorage, loadFromStorage} from '../services/utils.service.js';

const KEY = 'snake_best_score';

export default {
    checkIfNewBestScore,
    loadScore,
    saveScore
}

function checkIfNewBestScore(score) {
    if (!score) return false;
    var prevScore = loadScore();
    if (!prevScore || prevScore.score < score) return true;
    return false;
}

function loadScore() {
    return loadFromStorage(KEY);
}

function saveScore(score, by) {
    storeToStorage(KEY, {score, by});
}