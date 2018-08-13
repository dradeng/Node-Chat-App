var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

var isInList = (value, list) => {
    return (list instanceof Array) && list.indexOf(value) > -1;
};

module.exports = {isRealString, isInList};