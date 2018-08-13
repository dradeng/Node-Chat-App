const moment = require('moment');
const {isRealString} = require('./validation');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        latitude,
        longitude,
        createdAt: moment().valueOf()
    }
};

var generateAckError = (errorMessage) => {
    return _generateAck(errorMessage, null);
};

var generateAckOk = (data) => {
    return _generateAck(null, data);
};

var _generateAck = (errorMessage, data) => {
    return {
        error: errorMessage || null,
        data: data || null
    }
};

module.exports = { generateMessage, generateLocationMessage, generateAckError, generateAckOk};