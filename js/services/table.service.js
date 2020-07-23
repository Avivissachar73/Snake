'use strict';

export class TableService {
    static id = 0;
    element = null;
    constructor(selector = 'body', board = [], getCellContentFunc) {
        this.id = 'table-' + TableService.id++;
        this.parentSelector = selector;
        this.board = board;

        this.getCellContentFunc = getCellContentFunc;
        this.getCellContent = (pos, cell) => {
            if (getCellContentFunc) return getCellContentFunc(pos, cell);
            else if (typeof(cell) === 'object') return JSON.stringify(cell);
            else return cell;
        }
    }

    get selector() {
        return '#' + this.id;
    }

    render = () => {
        var board = this.board;
        var htmlStr = `<table id="${this.id}">`;
        for (let i = 0; i < board.length; i++) {
            htmlStr += '<tr>';
            for (let j = 0; j < board[i].length; j++) {
                let cell = board[i][j];
                htmlStr += `<td id="${this._getCellIdByPos({i,j})}" class="board-cell">
                                ${this.getCellContent({i, j}, cell)}
                            </td>`
            }
            htmlStr += '</tr>';
        }
        htmlStr += '</table>';
        
        var el = document.createElement('div');
        el.innerHTML = htmlStr;
        el = el.firstChild;

        var elParent = document.querySelector(this.parentSelector);
        if (this.element) elParent.removeChild(this.element);
        this.element = el;
        elParent.appendChild(el);
    }

    updateCell(pos, item) {
        this.board[pos.i][pos.j] = item;
        this._getElCellByPos(pos).innerHTML = this.getCellContent(pos, item);
    }

    _getCellIdByPos({i,j}) {
        return `cell-${i}-${j}`;
    }

    _getElCellByPos(pos) {
        var cellId = this._getCellIdByPos(pos);
        return document.querySelector(`#${this.id} #${cellId}`);
    }

    setReSizeBoard(isListenToResize = false) {
        const reSizeBoard = () => {
            var elParent = this.element.parentNode;
            var boardWidth = elParent.offsetWidth;
            var elTable = this.element;
            var rowCount = elTable.querySelector('tr').querySelectorAll('td').length;
            var tdWidth = boardWidth / rowCount;
            var boardFontSize = tdWidth/1.55;
            elTable.querySelectorAll('td').forEach(elTd => {
                elTd.style.width = tdWidth + 'px';
                elTd.style.height = tdWidth + 'px';
            })
            elTable.style.width = boardWidth + 'px';
            elTable.style.height = boardWidth + 'px';
            elTable.style['font-size'] = boardFontSize + 'px';
        }
        reSizeBoard();
        if (isListenToResize) window.addEventListener('resize', reSizeBoard);
    }
}