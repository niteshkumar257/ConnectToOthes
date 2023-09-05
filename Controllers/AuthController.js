import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Registering a new User

export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  
  try {
    const newUser=await UserModel.create({
      username,password:hashedPass,lastname:lastname,firstname:firstname
    })
    const modifyUser={
      username:newUser.username
    }
    res.status(200).json(modifyUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// login User

export const loginUser = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await UserModel.findOne({username: username})


        if(user)
        {
            const validity = await bcrypt.compare(password, user.password)

             if(validity)
             {
               jwt.sign({userId:user.userId,username:user
              .username},process.env.JWT_SECRET,{expiresIn:'1h'},(err,token)=>
              {
                res.status(200).json(token);
              })
             }
             else res.status(401).json("UnAuthorized user");
           
        }
        else{
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}