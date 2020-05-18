"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
let Employee = /** @class */ (() => {
    class Employee {
        constructor(id, name, salary) {
            this.id = id;
            this.name = name;
            this.salary = salary;
            Employee.count++;
        }
        get location() {
            return this._location;
        }
        set location(val) {
            this._location = val;
        }
        static getCount() {
            return Employee.count;
        }
    }
    Employee.count = 0;
    return Employee;
})();
exports.Employee = Employee;
