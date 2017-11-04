//Jan 1st 1970 00:00:00 am UTC

//milliseconds in javascript
//1000 equals 1 second

const moment = require('moment');

// var date = new Date();

// console.log(date.getMonth());

let date = moment();
//date.add(1, 'year').subtract(9, 'months');
//console.log(date.format('MMM do, YYYY'));

console.log(date.format('h:mm a'))
