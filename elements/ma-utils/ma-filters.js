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

PolymerExpressions.prototype.toBaseUrl = function(input){
    if(input == null)
        return;
    var baseURL = document.URL.split('#')[0];
    return baseURL + input;
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}