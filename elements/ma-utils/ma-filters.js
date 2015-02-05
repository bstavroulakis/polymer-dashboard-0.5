PolymerExpressions.prototype.linkPath = function(value) {
    value = value.trim();
    if (value == null || value == '') {
        return '#0' ;
    }
    else {
        return '#' + value;
    }
};

PolymerExpressions.prototype.maDateView = function(input) {
    if(input == null)
        return input;
    return input.toLocaleString();
};