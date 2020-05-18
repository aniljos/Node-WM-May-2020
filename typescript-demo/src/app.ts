import {Employee} from './employee';

console.log("Count: ", Employee.getCount());
const emp = new Employee(1, "Anil", 8000);
console.log(emp.id)
console.log(emp.name);
console.log(emp.salary);
emp.location = "Mumbai";
console.log(emp.location);
console.log("Count: ", Employee.getCount());