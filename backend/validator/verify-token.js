const jwt = require("jsonwebtoken")
const privateKey = "null";

const verifyUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(400).send("user access denied");
  
    try {
      const verifiedUser = jwt.verify(token, privateKey);
      req.user = verifiedUser;
      next();
    } catch (err) {
      res.status(400).send("invalid user token");
    }
}

const verifyAdmin = (req, res, next) => {
    const token = req.header("admin-token");
    if (!token) return res.status(400).send("admin access denied");
  
    try {
      const verifiedAdmin = jwt.verify(token, privateKey);
      req.admin = verifiedAdmin;
      next();
    } catch (err) {
      res.status(400).send("invalid admin token");
    }
};

module.exports = { verifyUser, verifyAdmin }