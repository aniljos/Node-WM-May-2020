class Car {
    //implemention(1)
    constructor(name, speed, gears) {
        this.name = name;
        this.speed = speed;
        this.gears = gears;
    }
    applyBrakes(decrement) {
        this.speed -= decrement;
    }
    print() {
        console.log(`Name: ${this.name}, Speed: ${this.speed}, Gears: ${this.gears}`);
    }
}
const car1 = new Car();
car1.name = "Audi";
car1.speed = 220;
car1.gears = 6;
car1.print();
car1.applyBrakes(100);
car1.print();
const car2 = new Car("BMW", 300, 5);
car2.print();
