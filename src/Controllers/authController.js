const User = require("../Models/UserModel");
const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async(req, res)=>{
try {
  const {name, email, password, role} =req.body;

  const user = await User.findOne({email});
      if (user){
       return res.status(400).json({message :"User already exist"});
      }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    res.json({message: "User created Succesfully!", newUser})
  
} catch (error) {
  res.status(500).json({message: "Servor Error", error});
}};

const login = async(req, res)=>{
  try {
    const {email, password}= req.body;

    const isUserThere = await User.findOne({email});

    if (!isUserThere){
      return res.status(404).json({message: "User Not Found"})
    };

    const isPasswordMatch = await bcrypt.compare(password, isUserThere.password)
    if (!isPasswordMatch){
      return res.status(400).json({message: "Invalid Password"})
    };

    const token = jwt.sign({
      id: isUserThere._id,
      role:isUserThere.role
    },
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  );

  res.json({
    message: "Logged in Succesfully",
    token
  });

  } catch (error) {
    res.status(500).json({message: "Server Error"});
  }
};
module.exports= {register, login};