var crypto = require('crypto-js');
var User = require('../container/user/models/user');

const checkToken = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let userToken = req.body.userToken;
    if (!userId) {
      return res.status(401).send("No userId provided !");
    }
    if (!userToken) {
      return res.status(401).send("No userToken provided !");
    }
    var bytesUserId = crypto.AES.decrypt(userId, process.env.secret);
    var bytesUserToken = crypto.AES.decrypt(userToken, process.env.secret);
    var userId_decode = bytesUserId.toString(crypto.enc.Utf8);
    var userToken_decode = bytesUserToken.toString(crypto.enc.Utf8);
    if (!userId_decode) {
      return res.status(401).send("userId incorrect !");
    }
    if (!userToken_decode) {
      return res.status(401).send("userToken incorrect !");
    }
    if (req._parsedUrl.pathname !== '/users/home') {
      let user = await User.findOne({ id: userId_decode });
      if (!user) {
        return res.status(401).json({
          data: null,
          success: false,
          message: 'User not exist'
        });
      }
    }
    req.user = {
      userId: userId_decode,
      userToken: userToken_decode,
    }
    return next();
  } catch (e) {
    console.log("Error :", e);
    return res.status(401).json({
      data: null,
      success: false,
      message: e
    });
  }
};

module.exports = {
  checkToken
}