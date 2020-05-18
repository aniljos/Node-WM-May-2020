interface Vehicle{

    name: string;
    speed: number;
    gears?: number;

    applyBrakes(decrement: number): void;
    print(): void;

}
class Car implements Vehicle{

    name: string;
    speed: number;
    gears?: number;

    //declartions(*)
    constructor();
    constructor(name: string, speed: number, gears: number);

    //implemention(1)
    constructor(name?: string, speed?: number, gears?: number){
        this.name = name;
        this.speed = speed;
        this.gears = gears;
    }

    applyBrakes(decrement: number): void {
        this.speed -= decrement;
    }
    print(): void{
        console.log(`Name: ${this.name}, Speed: ${this.speed}, Gears: ${this.gears}`);
    }
}

const car1: Vehicle = new Car();
car1.name = "Audi"; car1.speed= 220; car1.gears = 6;
car1.print();
car1.applyBrakes(100);
car1.print();

const car2 = new Car("BMW", 300, 5);
car2.print();



