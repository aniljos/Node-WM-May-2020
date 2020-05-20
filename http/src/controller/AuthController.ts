import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';

let users: Array<{ name: string, password: string }>;
const JWT_ACCESS_TOKEN_SECRET = "a7bffd9133b5abc893cfce78c2973a0fcd1a8307dca3334209d4951a53bc0c9b1fd9113ef3b238aaa4297985ba4e4fdee6e7d99d880c2a3ff3c39b16bcd2907a";

function loadUsers() {
    users = [];
    users.push({ name: "sachin", password: "t_sachin" });
    users.push({ name: "virat", password: "k_virat" });
    users.push({ name: "dhoni", password: "m_dhoni" });
}
loadUsers();

export const loginAction = (req: Request<any>, resp: Response<any>)=> {

    //validate the credentials
    //generate a JWT token 
    // invalid --return error code
    const reqUser = { name: req.body.name, password: req.body.password };
    const user =
        users.find(item => item.name === reqUser.name && item.password === reqUser.password);   
    if (user) {
        const accessToken = jwt.sign(user, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
        resp.json({ accessToken });
    }
    else {
        
        resp.sendStatus(401);
    }
}

export const authorizeProducts = (req: Request<any>, resp: Response<any>, next: NextFunction) => {

    // authorization : Bearer sjgsjfhgsjdgh77657656ggfgfhgfhfh
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.toString().split(' ')[1];
    if (token == null) {
        resp.sendStatus(401);
        return;
    }
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return resp.sendStatus(403);

        console.log("User logged in: ", user);
        next();
    })

}

