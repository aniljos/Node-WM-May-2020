//interface ==> defining the model
function createRect(config) {
    return {
        area: config.x * config.y,
        color: config.color ? config.color : 'red',
        getColor: () => {
            return this.color;
        }
    };
}
console.log(createRect({ x: 10, y: 20 }));
function createCircle(config) {
    if (config.radius > 0) {
        return {
            area: 2 * 3.14 * (config.radius * config.radius),
            color: config.color
        };
    }
    else {
        return "Unknown shape";
    }
}
console.log(createCircle({ radius: 100, color: 'green' }));
console.log(createCircle({ radius: 0, color: 'green' }));
function foo(name) {
}
