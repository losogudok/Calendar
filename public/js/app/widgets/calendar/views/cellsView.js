/**
 * Created by andrey on 12.06.14.
 */
define(function(require){

    // Modules

    var PubSub = require('pubsub');
    var date = require('./../date');
    var calendarBody;
    var prevCalendar;

    // Element

    var rootEl = document.querySelector('#calendarBody');

    // Render functions

    function updateCells(date){
        var el = document.createElement('div'),
            prevCalendar = document.querySelector('.calendar-widget'),
            row = el.cloneNode(),
            cell = el.cloneNode(),
            currentRow,
            currentCell,
            cellsInRow = 0,
            i = 0,
            j = 0,
            k = 0,
            cellDate;


        el.classList.add('calendar-widget');
        row.classList.add('calendar-row');
        cell.classList.add('calendar-cell');
        cell.setAttribute('data-date', '');

        currentRow = row.cloneNode();
        currentCell = cell.cloneNode();

//      Create cells for previous month

        for (; j < date.curr.firstWeekday; j++) {
            currentCell.classList.add('other-month');
            currentCell.textContent = date.prev.daysAmount - date.curr.firstWeekday + j + 1;
            currentRow.appendChild(currentCell);
            currentCell = cell.cloneNode();
            cellsInRow++;
        }

//      Create cells for current moth

        while(i < date.curr.daysAmount) {
            if (cellsInRow === 7) {
                cellsInRow = 0;
                el.appendChild(currentRow);
                currentRow = row.cloneNode();
            }
            currentCell = cell.cloneNode();
            currentCell.classList.add('js-current-month');
            currentCell.classList.add('current-month');
            cellDate = new Date();
            cellDate.setDate(i + 1);
            currentCell.dataset.date = cellDate.toISOString().slice(0, 10).replace(/-/g, '').replace(/(\d{4})(\d{2})(\d{2})/,"$3" + "$2" + "$1");
            currentCell.textContent = i + 1;
            currentRow.appendChild(currentCell);

            i++;
            cellsInRow++;
        }

//      Create cells for next month

        if (cellsInRow != 0) {
            while (cellsInRow != 7) {
                currentCell = cell.cloneNode();
                currentCell.classList.add('other-month');
                currentCell.innerText = k + 1;
                currentRow.appendChild(currentCell);
                k++;
                cellsInRow++;
            }
            el.appendChild(currentRow);
        }

        if (prevCalendar) {
            rootEl.removeChild(prevCalendar);
        }
        rootEl.appendChild(el);
        return el;
    }

    function highlightCurrDay(date) {
        if (new Date().getMonth() === date.curr.month && new Date().getFullYear() === date.curr.year) {
            var currDate = new Date().toISOString().slice(0, 10).replace(/-/g, '').replace(/(\d{4})(\d{2})(\d{2})/,"$3" + "$2" + "$1");
            document.querySelector('[data-date="' + currDate + '"]').classList.add('current-day');
        }
    }


    function init() {
        PubSub.subscribe('month.paint', changeMonth);
    }
    return {
        init: init
    }
});