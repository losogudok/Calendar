/**
 * Created by andrey on 02.05.14.
 */
define(function (require) {

    // Modules

    var PubSub = require('pubsub');


    var date,
        currentYear,
        currentMonth,
        daysInMonths,
        normalWeekDay = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        };

    function getCurrentMonthDay() {
        return date.getDate();
    }

    function getCurrentWeekDay() {
        return normalWeekDay[date.getDay()];
    }

    function getCurrentMonth() {
        return date.getMonth()
    }

    function getCurrentYear() {
        return date.getFullYear();
    }

    function getDaysInCurrentMonth() {
        return daysInMonths[currentMonth];
    }

    function getDaysInFebruary() {
        if ((currentYear % 100 != 0) && (currentYear % 4 == 0) || (currentYear % 400 == 0)) {
            return 29;
        } else {
            return 28;
        }
    }

    function getDaysInPreviousMonth() {
        var prevDate = new Date(date.getTime());
        prevDate.setMonth(currentMonth - 1);
        return daysInMonths[prevDate.getMonth()];
    }

    function getFirstWeekDayInMonth() {
        return normalWeekDay[new Date(currentYear, currentMonth).getDay()];
    }

    function getPrevMonthTime() {
        var prevMonth = new Date(date.getTime());
        prevMonth.setDate(1);
        prevMonth.setMonth(date.getMonth()-1);
        return prevMonth.getTime();
    }

    function getNextMonthTime() {
        var nextMonth = new Date(date.getTime());
        nextMonth.setDate(1);
        nextMonth.setMonth(date.getMonth()+1);
        return nextMonth.getTime();
    }

    function calcDate(msg, time) {
        var dateObj;
        date = time ? new Date(time) : new Date();
        currentYear = getCurrentYear();
        currentMonth = getCurrentMonth();
        daysInMonths = [31, getDaysInFebruary(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        dateObj = {
            curr: {
                day: getCurrentMonthDay(),
                weekday: getCurrentWeekDay(),
                month: getCurrentMonth(),
                year: getCurrentYear(),
                firstWeekday: getFirstWeekDayInMonth(),
                daysAmount: getDaysInCurrentMonth()
            },
            prev: {
                daysAmount: getDaysInPreviousMonth(),
                time: getPrevMonthTime()
            },
            next: {
                time: getNextMonthTime()
            }
    }

    function init() {
        PubSub.subscribe('date.calc', calcDate);
        PubSub.subscribe('month.change', calcDate);
    }

    return {
        init: init
    };
});