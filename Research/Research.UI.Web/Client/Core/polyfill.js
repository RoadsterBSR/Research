

if (!Object.copyPropertyValues) {
    Object.copyPropertyValues = function (source, destination) {
        if (source && destination) {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    destination[prop] = source[prop];
                }
            }
        }
    };
}

if (!Object.is) {
    Object.is = function (v1, v2) {
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2;
        }
        if (v1 !== v1) {
            return v2 !== v2;
        }
        return v1 === v2;
    };
}