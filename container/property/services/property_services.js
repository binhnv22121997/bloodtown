var Property = require('../models/property');
var User = require('../../user/models/user');
var apiBtamin = require('../../apiBtamin');

async function getAll() {
  return await Property.find({}).sort({ id: 1 });;
}

async function buyProperty(userId, userToken, propertyId) {
  try {
    let userById = await User.findOne({ id: userId });
    let property = await Property.findOne({ id: propertyId });
    if (!property) {
      return {
        success: false,
        message: "Property not exist !"
      };
    }
    if (userById.level < property.min_level) {
      return {
        success: false,
        message: "User not enough level !"
      };
    }
    let userUsedProperties = userById.usedProperties;
    let index = getIndexUserProperties(userUsedProperties, propertyId);
    if (index === -1) {
      let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
      if (!isPending) {
        return {
          success: false,
          message: "Buy property is pending !"
        }
      }
      let result = await apiBtamin.payOrReward(userId, userToken, property.btamin, userById.btamin);
      if (!result.success) {
        await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
        return result;
      }
      userById.btamin = result.btamin;
      userUsedProperties.push({
        propertyId: propertyId,
        startTime: Date.now()
      });
      userById.usedProperties = userUsedProperties;
      userById.properties = userUsedProperties.length;
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          properties: userById.properties,
          usedProperties: userById.usedProperties
        },
        success: true,
        message: "Buy property successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    return {
      success: false,
      message: "Property user exist !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function getIncome(userId, userToken, propertyId) {
  try {
    let userById = await User.findOne({ id: userId });
    let property = await Property.findOne({ id: propertyId });
    if (!property) {
      return {
        success: false,
        message: "Property not exist !"
      };
    }
    let userUsedProperties = userById.usedProperties;
    let startTime = 0;
    var index = getIndexUserProperties(userUsedProperties, propertyId);
    if (index !== -1) {
      startTime = userUsedProperties[index].startTime;
      if (Date.now() - startTime >= property.time) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Get Income is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, property.income, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        userUsedProperties[index].startTime = Date.now();
        userById.usedProperties = userUsedProperties;
        userById.income += property.income;
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            btamin: userById.btamin,
            usedProperties: userById.usedProperties,
            income: userById.income
          },
          success: true,
          message: "Get income property successful !",
          reqData: result.reqData,
          resData: result.resData
        }
      } else {
        return {
          success: false,
          message: "Not enough time to get income !"
        };
      }
    }
    return {
      success: false,
      message: "Property user not exist !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }

}

function getIndexUserProperties(userUsedProperties, propertyId) {
  var index = -1;
  userUsedProperties.map((element, i) => {
    if (element.propertyId === propertyId) {
      index = i;
      return;
    }
  });
  return index;
}

module.exports = {
  getAll,
  buyProperty,
  getIncome
}