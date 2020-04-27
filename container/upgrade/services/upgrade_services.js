var User = require('../../user/models/user');
var Home = require('../home/models/home');
var Garage = require('../garage/models/garage');
var Hangar = require('../hangar/models/hangar');
var Quay = require('../quay/models/quay');
var apiBtamin = require('../../apiBtamin');

async function getAll() {
  let homes = await Home.find({}).sort({ id: 1 });
  let garages = await Garage.find({}).sort({ id: 1 });
  let hangars = await Hangar.find({}).sort({ id: 1 });
  let quays = await Quay.find({}).sort({ id: 1 });
  return {
    homes,
    garages,
    hangars,
    quays
  }
}

async function buyUpgrade(userId, userToken, upgradeId, upgradeType) {
  try {
    let userById = await User.findOne({ id: userId });
    switch (upgradeType) {
      case "Home": {
        if (userById.home_id === upgradeId - 1) {
          upgrade = await Home.findOne({ id: upgradeId });
          if (!upgrade) {
            return {
              success: false,
              message: "Home not exist !"
            };
          }
          if (userById.level >= upgrade.min_level) {
            var updateUser = await User.updateUser({
              userId,
              respect: upgrade.respect
            });
            if (updateUser.success) {
              let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
              if (!isPending) {
                return {
                  success: false,
                  message: "Buy upgrade home is pending !"
                }
              }
              let result = await apiBtamin.payOrReward(userId, userToken, upgrade.btamin, userById.btamin);
              if (!result.success) {
                await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
                return result;
              }
              userById = updateUser.data;
              userById.btamin = result.btamin;
              userById.home_id = upgradeId;
              await userById.save();
              await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
              return {
                data: {
                  btamin: userById.btamin,
                  level: userById.level,
                  respect: userById.respect,
                  home_id: userById.home_id
                },
                success: true,
                message: "Upgrade Home successful !",
                reqData: result.reqData,
                resData: result.resData,
              };
            } else {
              return {
                success: false,
                message: updateUser.message
              };
            }
          } else {
            return {
              success: false,
              message: "User not enough level !"
            };
          }
        } else {
          return {
            success: false,
            message: "Home level not eligible !"
          };
        }
      }
      case "Garage": {
        if (userById.garage_id === upgradeId - 1) {
          upgrade = await Garage.findOne({ id: upgradeId });
          if (!upgrade) {
            return {
              success: false,
              message: "Garage not exist !"
            };
          }
          if (userById.level >= upgrade.min_level) {
            var updateUser = await User.updateUser({
              userId,
              respect: upgrade.respect
            });
            if (updateUser.success) {
              let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
              if (!isPending) {
                return {
                  success: false,
                  message: "Buy upgrade garage is pending !"
                }
              }
              let result = await apiBtamin.payOrReward(userId, userToken, upgrade.btamin, userById.btamin);
              if (!result.success) {
                await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
                return result;
              }
              userById = updateUser.data;
              userById.btamin = result.btamin;
              userById.garage_id = upgradeId;
              await userById.save();
              await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
              return {
                data: {
                  btamin: userById.btamin,
                  level: userById.level,
                  respect: userById.respect,
                  garage_id: userById.garage_id
                },
                success: true,
                message: "Upgrade Garage successful !",
                reqData: result.reqData,
                resData: result.resData
              };
            } else {
              return {
                success: false,
                message: updateUser.message
              };
            }
          } else {
            return {
              success: false,
              message: "User not enough level !"
            };
          }
        } else {
          return {
            success: false,
            message: "Garage level not eligible !"
          };
        }
      }
      case "Hangar": {
        if (userById.hangar_id === upgradeId - 1) {
          upgrade = await Hangar.findOne({ id: upgradeId });
          if (!upgrade) {
            return {
              success: false,
              message: "Hangar not exist !"
            };
          }
          if (userById.level >= upgrade.min_level) {
            var updateUser = await User.updateUser({
              userId,
              respect: upgrade.respect
            });
            if (updateUser.success) {
              let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
              if (!isPending) {
                return {
                  success: false,
                  message: "Buy upgrade hangar is pending !"
                }
              }
              let result = await apiBtamin.payOrReward(userId, userToken, upgrade.btamin, userById.btamin);
              if (!result.success) {
                await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
                return result;
              }
              userById = updateUser.data;
              userById.btamin = result.btamin;
              userById.hangar_id = upgradeId;
              await userById.save();
              await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
              return {
                data: {
                  btamin: userById.btamin,
                  level: userById.level,
                  respect: userById.respect,
                  hangar_id: userById.hangar_id
                },
                success: true,
                message: "Upgrade Hangar successful !",
                reqData: result.reqData,
                resData: result.resData
              };
            } else {
              return {
                success: false,
                message: updateUser.message
              };
            }
          } else {
            return {
              success: false,
              message: "User not enough level !"
            };
          }
        } else {
          return {
            success: false,
            message: "Hangar level not eligible !"
          };
        }
      }
      case "Quay": {
        if (userById.quays_id === upgradeId - 1) {
          upgrade = await Quay.findOne({ id: upgradeId });
          if (!upgrade) {
            return {
              success: false,
              message: "Quay not exist !"
            };
          }
          if (userById.level >= upgrade.min_level) {
            var updateUser = await User.updateUser({
              userId,
              respect: upgrade.respect
            });
            if (updateUser.success) {
              let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
              if (!isPending) {
                return {
                  success: false,
                  message: "Buy upgrade quay is pending !"
                }
              }
              let result = await apiBtamin.payOrReward(userId, userToken, upgrade.btamin, userById.btamin);
              if (!result.success) {
                await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
                return result;
              }
              userById = updateUser.data;
              userById.btamin = result.btamin;
              userById.quays_id = upgradeId;
              await userById.save();
              await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
              return {
                data: {
                  btamin: userById.btamin,
                  level: userById.level,
                  respect: userById.respect,
                  quays_id: userById.quays_id
                },
                success: true,
                message: "Upgrade Quay successful !",
                reqData: result.reqData,
                resData: result.resData
              };
            } else {
              return {
                success: false,
                message: updateUser.message
              };
            }
          } else {
            return {
              success: false,
              message: "User not enough level !"
            };
          }
        } else {
          return {
            success: false,
            message: "Quay level not eligible !"
          };
        }
      }
      default: {
        return {
          success: false,
          message: "Upgrade not exist !"
        };
      }
    }
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

module.exports = {
  getAll,
  buyUpgrade
}