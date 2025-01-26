import asyncHandler from 'express-async-handler'
import {prisma} from '../config/prismaConfig.js'

export const createUser = asyncHandler(async (req, res) => {
    console.log("Creating a user")
    
    let { email } = req.body;
    
    console.log(email)
    /*
    const {name, email, password} = req.body;
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    })
    res.json(user)
    */
})
