var RoadVehicle = require('../roadvehicle/models/road_vehicle');
var Plane = require('../plane/models/plane');
var Boat = require('../boat/models/boat');
var User = require('../../user/models/user');
var Garage = require('../../upgrade/garage/models/garage');
var Hangar = require('../../upgrade/hangar/models/hangar');
var Quay = require('../../upgrade/quay/models/quay');
var apiBtamin = require('../../apiBtamin');

async function getAll() {
  let roadvehicles = await RoadVehicle.find({}).sort({ id: 1 });
  let planes = await Plane.find({}).sort({ id: 1 });
  let boats = await Boat.find({}).sort({ id: 1 });
  return {
    roadvehicles,
    planes,
    boats
  }
}

async function buyVehicle(userId, userToken, vehicleId, vehicleType) {
  let userById = await User.findOne({ id: userId });
  if (!userById) {
    return {
      success: false,
      message: "User not exist !"
    };
  }
  switch (vehicleType) {
    case 'RoadVehicle': {
      if (userById.garage_id) {
        vehicle = await RoadVehicle.findOne({ id: vehicleId });
        if (!vehicle) {
          return {
            success: false,
            message: "RoadVehicle not exist !"
          };
        }
        let garage = await Garage.findOne({ id: userById.garage_id });
        if (userById.roadvehicles.length >= garage.max_vehicles) {
          return {
            success: false,
            message: "Garage full RoadVehicle !"
          };
        }
        if (checkIdArray(vehicleId, userById.roadvehicles)) {
          return {
            success: false,
            message: "RoadVehicle exist in Garage !"
          };
        }
        break;
      } else {
        return {
          success: false,
          message: "User not have Garage !"
        };
      }
    }
    case 'Plane': {
      if (userById.hangar_id) {
        vehicle = await Plane.findOne({ id: vehicleId });
        if (!vehicle) {
          return {
            success: false,
            message: "Plane not exist !"
          };
        }
        let hangar = await Hangar.findOne({ id: userById.hangar_id });
        if (userById.planes.length >= hangar.max_vehicles) {
          return {
            success: false,
            message: "Hangar full Plane !"
          };
        }
        if (checkIdArray(vehicleId, userById.planes)) {
          return {
            success: false,
            message: "Plane exist in Hangar !"
          };
        }
        break;
      } else {
        return {
          success: false,
          message: "User not have Hangar !"
        };
      }
    }
    case 'Boat': {
      if (userById.quays_id) {
        vehicle = await Boat.findOne({ id: vehicleId });
        if (!vehicle) {
          return {
            success: false,
            message: "Boat not exist !"
          };
        }
        let quay = await Quay.findOne({ id: userById.quays_id });
        if (userById.boats.length >= quay.max_vehicles) {
          return {
            success: false,
            message: "Quay full Boat !"
          };
        }
        if (checkIdArray(vehicleId, userById.boats)) {
          return {
            success: false,
            message: "Boat exist in Quay !"
          };
        }
        break;
      } else {
        return {
          success: false,
          message: "User not have Quay !"
        };
      }
    }
    default: {
      return {
        success: false,
        message: "Vehicle Type not exist !"
      };
    }
  }
  if (userById.level < vehicle.min_level) {
    return {
      success: false,
      message: "User not enough level !"
    };
  }
  let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
  if (!isPending) {
    return {
      success: false,
      message: "Buy vehicle is pending !"
    }
  }
  let result = await apiBtamin.payOrReward(userId, userToken, vehicle.btamin, userById.btamin);
  if (!result.success) {
    await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
    return result;
  }
  userById.btamin = result.btamin;
  let vehicleUser = {
    id: vehicle.id,
    btamin_sell: vehicle.btamin_sell,
    vehicleType: vehicleType,
    speed: {
      current_speed: vehicle.speed,
      index: 0,
    },
    acceleration: {
      current_acceleration: vehicle.acceleration,
      index: 0,
    },
    stability: {
      current_stability: vehicle.stability,
      index: 0,
    }
  }
  switch (vehicleType) {
    case 'RoadVehicle': {
      userById.roadvehicles.push(vehicleUser);
      if (!userById.mainVehicle.vehicleId) {
        userById.mainVehicle = {
          vehicleId: vehicleId,
          vehicleType: vehicleType
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          roadvehicles: userById.roadvehicles,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Buy RoadVehicle successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Plane': {
      userById.planes.push(vehicleUser);
      if (!userById.mainVehicle.vehicleId) {
        userById.mainVehicle = {
          vehicleId: vehicleId,
          vehicleType: vehicleType
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          planes: userById.planes,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Buy Plane successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Boat': {
      userById.boats.push(vehicleUser);
      if (!userById.mainVehicle.vehicleId) {
        userById.mainVehicle = {
          vehicleId: vehicleId,
          vehicleType: vehicleType
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          boats: userById.boats,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Buy Boat successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    default: {
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        success: false,
        message: "Vehicle Type not exist !"
      };
    }
  }
}

async function sellVehicle(userId, userToken, vehicleId, vehicleType) {
  let userById = await User.findOne({ id: userId });
  if (!userById) {
    return {
      success: false,
      message: "User not exist !"
    };
  }
  let vehicle;
  switch (vehicleType) {
    case 'RoadVehicle': {
      vehicle = userById.roadvehicles.find(el => el.id === vehicleId);
      break;
    }
    case 'Plane': {
      vehicle = userById.planes.find(el => el.id === vehicleId);
      break;
    }
    case 'Boat': {
      vehicle = userById.boats.find(el => el.id === vehicleId);
      break;
    }
    default: {
      return {
        success: false,
        message: "Vehicle Type not exist !"
      };
    }
  }
  if (!vehicle) {
    return {
      success: false,
      message: "User not have this vehicle !"
    };
  }
  let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
  if (!isPending) {
    return {
      success: false,
      message: "Sell vehicle is pending !"
    }
  }
  let result = await apiBtamin.payOrReward(userId, userToken, vehicle.btamin_sell, userById.btamin);
  if (!result.success) {
    await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
    return result;
  }
  userById.btamin = result.btamin;
  switch (vehicleType) {
    case 'RoadVehicle': {
      userById.roadvehicles = userById.roadvehicles.filter(el => el.id !== vehicleId);
      if (userById.mainVehicle.vehicleId === vehicleId && userById.mainVehicle.vehicleType === vehicleType) {
        userById.mainVehicle = {
          vehicleId: 0,
          vehicleType: ''
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          roadvehicles: userById.roadvehicles,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Sell RoadVehicle successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Plane': {
      userById.planes = userById.planes.filter(el => el.id !== vehicleId);
      if (userById.mainVehicle.vehicleId === vehicleId && userById.mainVehicle.vehicleType === vehicleType) {
        userById.mainVehicle = {
          vehicleId: 0,
          vehicleType: ''
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          planes: userById.planes,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Sell Plane successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Boat': {
      userById.boats = userById.boats.filter(el => el.id !== vehicleId);
      if (userById.mainVehicle.vehicleId === vehicleId && userById.mainVehicle.vehicleType === vehicleType) {
        userById.mainVehicle = {
          vehicleId: 0,
          vehicleType: ''
        }
      }
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          boats: userById.boats,
          mainVehicle: userById.mainVehicle
        },
        success: true,
        message: "Sell Boat successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    default: {
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        success: false,
        message: "Vehicle type not exist !"
      };
    }
  }
}

async function upgradeVehicle(userId, userToken, vehicleId, vehicleType, upgradeType) {
  let userById = await User.findOne({ id: userId });
  if (!userById) {
    return {
      success: false,
      message: "User not exist !"
    };
  }
  let vehicle;
  let vehicleById;
  switch (vehicleType) {
    case 'RoadVehicle': {
      vehicle = userById.roadvehicles.find(el => el.id === vehicleId);
      if (!vehicle) {
        return {
          success: false,
          message: "User not have this RoadVehicle !"
        };
      }
      vehicleById = await RoadVehicle.findOne({ id: vehicleId });
      if (!vehicleById) {
        return {
          success: false,
          message: "RoadVehicle not exist !"
        };
      }
      break;
    }
    case 'Plane': {
      vehicle = userById.planes.find(el => el.id === vehicleId);
      if (!vehicle) {
        return {
          success: false,
          message: "User not have this Plane !"
        };
      }
      vehicleById = await Plane.findOne({ id: vehicleId });
      if (!vehicleById) {
        return {
          success: false,
          message: "Plane not exist !"
        };
      }
      break;
    }
    case 'Boat': {
      vehicle = userById.boats.find(el => el.id === vehicleId);
      if (!vehicle) {
        return {
          success: false,
          message: "User not have this Boat !"
        };
      }
      vehicleById = await Boat.findOne({ id: vehicleId });
      if (!vehicleById) {
        return {
          success: false,
          message: "Boat not exist !"
        };
      }
      break;
    }
    default: {
      return {
        success: false,
        message: "Vehicle Type not exist !"
      };
    }
  }
  let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
  if (!isPending) {
    return {
      success: false,
      message: "Upgrade vehicle is pending !"
    }
  }
  let result;
  switch (upgradeType) {
    case 'speed': {
      if (vehicle.speed.index < vehicleById.upgrade_speed.length) {
        let index = vehicle.speed.index;
        result = await apiBtamin.payOrReward(
          userId,
          userToken,
          vehicleById.upgrade_speed_btamin[index],
          userById.btamin
        );
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        vehicle.speed.current_speed += vehicleById.upgrade_speed[index];
        vehicle.speed.index++;
        vehicle.btamin_sell -= vehicleById.upgrade_speed_btamin[index] / 2;
      } else {
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          success: false,
          message: "Upgrade speed max !"
        };
      }
      break;
    }
    case 'acceleration': {
      if (vehicle.acceleration.index < vehicleById.upgrade_acceleration.length) {
        let index = vehicle.acceleration.index;
        result = await apiBtamin.payOrReward(
          userId,
          userToken,
          vehicleById.upgrade_acceleration_btamin[index],
          userById.btamin
        );
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        vehicle.acceleration.current_acceleration += vehicleById.upgrade_acceleration[index];
        vehicle.acceleration.index++;
        vehicle.btamin_sell -= vehicleById.upgrade_acceleration_btamin[index] / 2;
      } else {
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          success: false,
          message: "Upgrade acceleration max !"
        };
      }
      break;
    }
    case 'stability': {
      if (vehicle.stability.index < vehicleById.upgrade_stability.length) {
        let index = vehicle.stability.index;
        result = await apiBtamin.payOrReward(
          userId,
          userToken,
          vehicleById.upgrade_stability_btamin[index],
          userById.btamin
        );
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        vehicle.stability.current_stability += vehicleById.upgrade_stability[index];
        vehicle.stability.index++;
        vehicle.btamin_sell -= vehicleById.upgrade_stability_btamin[index] / 2;
      } else {
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          success: false,
          message: "Upgrade stability max !"
        };
      }
      break;
    }
    default: {
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        success: false,
        message: "Upgrade Type not exist !"
      };
    }
  }
  await userById.save();
  await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
  switch (vehicleType) {
    case 'RoadVehicle': {
      const filter = { id: userId };
      const update = { roadvehicles: updateArray(vehicleId, userById.roadvehicles, vehicle) };
      await User.findOneAndUpdate(filter, update);
      return {
        data: {
          btamin: userById.btamin,
          roadvehicles: userById.roadvehicles
        },
        success: true,
        message: "Upgrade RoadVehicle successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Plane': {
      const filter = { id: userId };
      const update = { planes: updateArray(vehicleId, userById.planes, vehicle) };
      await User.findOneAndUpdate(filter, update);
      return {
        data: {
          btamin: userById.btamin,
          planes: userById.planes,
        },
        success: true,
        message: "Upgrade Plane successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    case 'Boat': {
      const filter = { id: userId };
      const update = { boats: updateArray(vehicleId, userById.boats, vehicle) };
      await User.findOneAndUpdate(filter, update);
      return {
        data: {
          btamin: userById.btamin,
          boats: userById.boats
        },
        success: true,
        message: "Upgrade Boat successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    }
    default: {
      return {
        success: false,
        message: "Vehicle Type not exist !"
      };
    }
  }
}

function checkIdArray(id, array) {
  let flag = false;
  array.forEach(element => {
    if (element.id === id) {
      flag = true;
    }
  });
  return flag;
}

function updateArray(id, array, newValue) {
  array.map((element, index) => {
    if (element.id === id) {
      array[index] = newValue;
      return;
    }
  });
  return array;
}

module.exports = {
  getAll,
  buyVehicle,
  sellVehicle,
  upgradeVehicle
};