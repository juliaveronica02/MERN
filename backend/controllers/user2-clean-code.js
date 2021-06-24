const Model = require("../models")
const UserModel = Model.user
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 12;
const privateKey = "null";
const validateRegister = require("../validator/register")
const validateLogin = require("../validator/login")

exports.signUp = async (req, res) => {
    const {error, value} = validateRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await UserModel.findOne({where: { email: req.body.email }})
    if (emailExist) return res.status(400).send({message: "Email already exist!"})

    try{
        const newUser = await createUserObj(req);
        const savedUser = await UserModel.create(newUser)
        return res.status(200).send({message: "User created successfully!", user: savedUser})
    } catch (err) {
        return res.status(400).send({error: "User create un-successfull!", error: err})
    }
}

const createUserObj = async (req) => {
    return {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds, 10),
      passwordConfirm: req.body.passwordConfirm,
    };
  }

exports.login = async (req, res) => {
    const {error} = validateLogin(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    //returns the first document that matches the query criteria or null.
    const foundUser = await UserModel.findOne({where: { email: req.body.email }})
    if (!foundUser) return res.status(400).send({message: "Email not found!"})
    
    try {
        const isMatch = await bcrypt.compareSync(req.body.password, foundUser.password)
        if (!isMatch) return res.status(400).send({message: "invalid password!"})
        // create and assign jwt.
        const token = await jwt.sign({id: foundUser.id}, privateKey)
        return res.status(200).header("auth-token", token).send({"auth-token": token, userId: foundUser.id})
    } catch (error) {
        return res.status(400).send(error)
    } 
}

exports.data = async (req, res) => {
    return res.json({
      posts: {
        title: "User Authentication",
        description: "random data you can access because you\'re authenticated",
      },
    });
  };