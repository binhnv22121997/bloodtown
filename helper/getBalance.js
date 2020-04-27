var apiBtamin = require('../container/apiBtamin');

const getBalance = async (req, res, next) => {
  try {
    let userBalance = await apiBtamin.userBalance(req.user.userId, req.user.userToken);
    if (!userBalance.success) {
      return res.status(401).send({
        data: null,
        success: false,
        message: userBalance.message
      });
    } else {
      req.user.balance = userBalance.data.balance;
      return next();
    }

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
  getBalance
}