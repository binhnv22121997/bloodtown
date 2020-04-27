var Pet = require('../models/pet')
var User = require('../../user/models/user');
var Home = require('../../upgrade/home/models/home');
var apiBtamin = require('../../apiBtamin');

async function getAll() {
  return await Pet.find({}).sort({ id: 1 });
}

async function buyPet(userId, userToken, petId) {
  try {
    let userById = await User.findOne({ id: userId });
    let petById = await Pet.findOne({ id: petId });
    if (!petById) {
      return {
        success: false,
        message: "Pet not exist !"
      };
    }
    let homeById = await Home.findOne({ id: userById.home_id });
    if (!homeById) {
      return {
        success: false,
        message: "Home user not exist !"
      };
    }
    if (userById.pets.indexOf(petId) === -1) {
      if (userById.level < petById.min_level) {
        return {
          success: false,
          message: "User level not enough !"
        };
      }
      if (userById.pets.length >= homeById.max_pets) {
        return {
          success: false,
          message: "Home is full pet !"
        };
      }
      var updateUser = await User.updateUser({
        userId,
        power: petById.power,
        agility: petById.agility,
        endurance: petById.endurance,
        intelligence: petById.intelligence
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Buy pet is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, petById.btamin, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.pets.push(petId);
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            pets: userById.pets,
            btamin: userById.btamin,
            power: userById.power,
            agility: userById.agility,
            endurance: userById.endurance,
            intelligence: userById.intelligence
          },
          success: true,
          message: "Buy pet successful !",
          reqData: result.reqData,
          resData: result.resData
        };
      } else {
        return {
          success: false,
          message: updateUser.message
        };
      }
    }
    return {
      success: false,
      message: "Pet exist in home !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function sellPet(userId, userToken, petId) {
  try {
    let userById = await User.findOne({ id: userId });
    let petById = await Pet.findOne({ id: petId });
    if (!petById) {
      return {
        success: false,
        message: "Pet not exist !"
      };
    }
    if (userById.pets.indexOf(petId) !== -1) {
      var updateUser = await User.updateUser({
        userId,
        power: -petById.power,
        agility: -petById.agility,
        endurance: -petById.endurance,
        intelligence: -petById.intelligence
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Sell pet is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, petById.btamin_sell, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.pets = userById.pets.filter(e => e !== petId);
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            pets: userById.pets,
            btamin: userById.btamin,
            power: userById.power,
            agility: userById.agility,
            endurance: userById.endurance,
            intelligence: userById.intelligence
          },
          success: true,
          message: "Sell pet successful !",
          reqData: result.reqData,
          resData: result.resData
        };
      } else {
        return {
          success: false,
          message: updateUser.message
        };
      }
    }
    return {
      success: false,
      message: "Pet not exist in home !"
    };
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
  buyPet,
  sellPet
};