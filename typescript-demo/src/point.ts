//interface ==> defining the model

interface RectConfig{
    x: number;
    y: number;
    color?: string;
}

interface Rect{
    area: number;
    color: string;
    getColor: () => string
}

function createRect(config: RectConfig): Rect{
    return {
        area : config.x * config.y,
        color: config.color? config.color: 'red',
        getColor: () => {
            return this.color;
        }
    }
}
console.log(createRect({x: 10, y: 20}));

type CircleConfig = {
    radius: number,
    color: string;
}

type Circle = {
    area: number,
    color: string
}

type CircleResult = Circle | string;

function createCircle(config: CircleConfig): CircleResult{

    if(config.radius > 0){
        return {
            area: 2 * 3.14 *(config.radius * config.radius),
            color: config.color
        }
    }
    else{
        return "Unknown shape";
    }
}
console.log(createCircle({radius: 100, color: 'green'}));
console.log(createCircle({radius: 0, color: 'green'}));


type Username = string;

function foo(name: Username): void{

}