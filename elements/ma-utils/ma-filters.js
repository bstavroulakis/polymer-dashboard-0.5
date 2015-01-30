PolymerExpressions.prototype.linkPath = function(value) {
    value = value.trim();
    if (value == null || value == '') {
        return '#0' ;
    }
    else {
        return '#' + value;
    }
};