const moment = require('moment');

const timeFormat = 'h:mm a';

var generateMessage = (from, text) => {
    let time = moment(moment().valueOf());
    time.utcOffset("+16:00");
    return {
        from,
        text,
        createdAt: time.format(timeFormat)
    };
};

var generateLocationMessage = (from, latitude, longitude) => {
    let time = moment(moment().valueOf());
    time.utcOffset("+16:00");
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: time.format(timeFormat)
    };
};

module.exports = {generateMessage, generateLocationMessage};