const Model = require("../models")
const UserModel = Model.user
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 12;
const privateKey = "null";
const validateRegister = require("../validator/register")
const validateLogin = require("../validator/login")

module.exports = {
    // user register.
    register: (req,res,next) => {
        // check validator when user register.
        const {errors, isValid} = validateRegister(req.body);
        // if not valid return status 400 (errors).
        if (!isValid) {
            return res.status(400).json(errors)
        }
        // find email and phone on database.
        // if already exists, user must use different email and phone to register.
        UserModel.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
              return res.status(401).json({ email: "Email already exists!" });
            } else {
                    const newUser = new UserModel({
                      username: req.body.username,
                      email: req.body.email,
                      password: req.body.password,
                      passwordConfirm: req.body.passwordConfirm,
                    });
                    // hash password.
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                      bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                          .save()
                          .then((result) => {
                            //  password confirm.
                            if (req.body.password !== req.body.passwordConfirm) {
                              res.json("Password undefined");
                            } else {
                              req.body.password == req.body.passwordConfirm;
                              res.json(result);
                            }
                          })
                          .catch((err) => {
                            throw err;
                          });
                      });
                    });
                  }
                }
              );
    },
    // user can login using phone or email.
    userLogin: (req, res) => {
        const {errors, isValid} = validateLogin(req.body)
        // check validation.
        if (!isValid) {
            return res.status(400).json(errors)
        }
        let {email, password} = req.body
    
    UserModel.findOne({where: {email: email} }).then((user) => {
      if (!user) {
        return res.status(404).json({ emailNotFound: "Email not found!" });
      }
      // Check password.
      bcrypt.compare(password, user.password).then((isMatch) => {
        console.log(isMatch);

        if (isMatch) {
          // User matched Create JWT Payload.
          const payload = {
            id: user.id,
            email: user.email,
          };
          // Sign token
          jwt.sign(
            payload,
            privateKey,
            {
              // expiresIn: 31556926, // 1 year in seconds
              // expiresIn: 60 * 60, // 1 hours.
              expiresIn: "24h", // 24 hours.
            },
            (err, token) => {
              res.json({
                success: true + " " + "user Session",
                token: token,
                id: user.id,
                email: user.email,
                username: user.username
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
    });
  })
  },
  // getAllData.
  getAllData: (req, res) => {
    UserModel.findAll({})
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
}