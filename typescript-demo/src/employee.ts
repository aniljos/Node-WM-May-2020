export class Employee{

    private static count: number = 0;

    private _location: string
    
    constructor(public id?: number, public name?: string, public salary?: number){
        Employee.count++;
    }
    public get location(){
        return this._location;
    }
    public set location(val){
        this._location = val;
    }
    public static getCount(){
        return Employee.count;
    }
}

