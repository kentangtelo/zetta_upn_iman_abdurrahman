const checkAuth = (req, res, next) => {
  //get the authorization header that was sent by the client
  try {
    const auth = req.headers["authorization"];

    /*
  auth = "Basic <encoded username:password>"
  get userpass via split and access index 1
  */

    const userpass = auth.split(" ")[1];

    //decode userpass to "username:password"
    const text = Buffer.from(userpass, "base64").toString("ascii");

    //get username and password individually
    const username = text.split(":")[0];
    const password = text.split(":")[1];

    if (username == process.env.user && password == process.env.password) {
      console.log("success");
      return next();
    }
    return res.status(401).json({
      status: "fail",
      message: "Access denied",
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = checkAuth;
