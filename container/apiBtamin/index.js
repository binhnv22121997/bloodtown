var aes256 = require('aes256');
var axios = require('axios');

async function userBalance(userId, userToken) {
  try {
    if (!userId || !userToken) {
      return {
        "success": false,
        "message": 'Not enough param !'
      }
    }
    const inputData = encryptObjectBySeckey({ account: userId, token: userToken }, process.env.RefeseckeyPoker);
    const outputData = await axios.post(`${process.env.apiBtamin}/btamin/account-balance`, { app: process.env.APP_POKER, data: inputData });
    return outputData.data;
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    };
  }
}

async function TxCreateReward(amount, userId) {
  try {
    if (!amount || !userId) {
      return {
        "success": false,
        "message": 'Not enough param !'
      }
    }
    const inputData = encryptObjectBySeckey({ amount: amount, receiver: userId }, process.env.RefeseckeyPoker);
    const outputData = await axios.post(`${process.env.apiBtamin}/btamin/tx-create-reward`, { app: process.env.APP_POKER, data: inputData });
    return outputData.data;
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function TxCreatePay(amount, userId, userToken) {
  try {
    if (!amount || !userId || !userToken) {
      return {
        "success": false,
        "message": 'Not enough param !'
      }
    }
    const inputData = encryptObjectBySeckey({ amount, account: userId, token: userToken }, process.env.RefeseckeyPoker);
    const outputData = await axios.post(`${process.env.apiBtamin}/btamin/tx-create-pay`, { app: process.env.APP_POKER, data: inputData })
    return outputData.data;
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

function encryptObjectBySeckey(obj, seckey, callback) {
  try {
    obj.ts = Date.now();
    return aes256.encrypt(seckey, JSON.stringify(obj));
  } catch (e) {
    return null;
  }
}

function decryptObjectBySeckey(data, seckey, callback) {
  try {
    return JSON.parse(aes256.decrypt(seckey, data));
  } catch (e) {
    return null;
  }
}

async function payOrReward(userId, userToken, amount, currentBtamin) {
  if (amount === 0) {
    return {
      success: true,
      btamin: currentBtamin
    }
  }
  if (amount === undefined) {
    return {
      success: false,
      message: 'Amount undefined',
      btamin: currentBtamin
    }
  }
  let reqData;
  let resData;
  if (amount < 0) {
    let pay = await TxCreatePay(-amount, userId, userToken);
    if (!pay.success) {
      let balance = await userBalance(userId, userToken);
      if (balance.success) {
        return {
          btamin: balance.data.balance,
          success: false,
          message: pay.message
        }
      }
      return {
        btamin: currentBtamin,
        success: false,
        message: pay.message
      }
    }
    let btamin = currentBtamin + amount;
    if (btamin < 0) {
      let balance = await userBalance(userId, userToken);
      btamin = balance.data.balance;
    }
    reqData = {
      amount,
      userId,
      type: 'TxCreatePay'
    }
    resData = pay;
    return {
      success: true,
      reqData,
      resData,
      btamin
    }
  } else {
    let pay = await TxCreateReward(amount, userId);
    if (!pay.success) {
      let balance = await userBalance(userId, userToken);
      if (balance.success) {
        return {
          btamin: balance.data.balance,
          success: false,
          message: pay.message
        }
      }
      return {
        btamin: currentBtamin,
        success: false,
        message: pay.message
      }
    }
    reqData = {
      amount,
      userId,
      type: 'TxCreateReward'
    }
    resData = pay;
    return {
      success: true,
      reqData,
      resData,
      btamin: currentBtamin + amount
    }
  }
}

module.exports = {
  userBalance,
  TxCreateReward,
  TxCreatePay,
  payOrReward,
};
