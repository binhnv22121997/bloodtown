var User = require("../models/user");
var Work = require('../../work/models/work');
var Gym = require('../../gym/models/gym');
var School = require('../../school/models/school');
var Hospital = require('../../hospital/models/hospital');
var Home = require('../../upgrade/home/models/home');
var apiBtamin = require('../../apiBtamin');
var character = require('../../../config/character');
var racingUser = require('../../../config/racing');
var fightUser = require('../../../config/fight');

async function getUser(userId, balance) {
  let user = await (await User.findOne({ id: userId }).sort({ id: 1 }).select(["-socketId", "-__v"]));
  if (!user) {
    user = new User({
      id: userId,
      btamin: balance,
    });
    await user.save();
  } else {
    if (user.btamin !== balance) {
      user.btamin = balance;
      await user.save();
    }
  }
  return user;
}

async function getHome() {
  return await Home.find({});
}

async function chooseCharacter(characterId, userId) {
  if (characterId === 1 || characterId === 2) {
    let chooseCharacter = await User.findOneAndUpdate({
      id: userId,
      character: false,
      value_character: 0
    }, {
      $set: {
        character: true,
        value_character: characterId
      }
    })

    if (chooseCharacter) {
      return {
        success: true,
        data: {
          character,
          value_character: characterId
        },
        statusCharacter: chooseCharacter.character
      }
    }
  } else {
    return User.find({ id: userId })
  }
}

async function getWork(userId, userToken, workId, workType) {
  try {
    let userById = await User.findOne({ id: userId });
    if (userById.work.workId) {
      return {
        success: false,
        message: "User is go to " + userById.work.workType
      };
    }
    switch (workType) {
      case "Work": {
        let work = await Work.findOne({ id: workId });
        if (!work) {
          return {
            success: false,
            message: "Work not exist !"
          };
        }
        let updateUser = await User.updateUser({
          userId,
          health: work.health,
          energy: work.energy
        });
        if (updateUser.success) {
          userById = updateUser.data;
          userById.work = {
            workId,
            workType,
            startTime: Date.now()
          }
          await userById.save();
          return {
            data: {
              health: userById.health,
              energy: userById.energy,
              work: userById.work
            },
            success: true,
            message: "Get Work successful !"
          };
        } else {
          return {
            success: false,
            message: updateUser.message
          };
        }
      }
      case "Hospital": {
        if (userById.health === parseInt(character.maxHealth)) {
          return {
            success: false,
            message: "Health is full not need go hospital !"
          }
        }
        let hospital = await Hospital.findOne({ id: workId });
        if (!hospital) {
          return {
            success: false,
            message: "Hospital not exist !"
          };
        }
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Get hospital is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, hospital.btamin, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        userById.work = {
          workId,
          workType,
          startTime: Date.now()
        }
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            btamin: userById.btamin,
            work: userById.work
          },
          success: true,
          message: "Get Hospital successful !",
          reqData: result.reqData,
          resData: result.resData
        };
      }
      case "Gym": {
        let gym = await Gym.findOne({ id: workId });
        if (!gym) {
          return {
            success: false,
            message: "Gym not exist !"
          };
        }
        if (userById.health === parseInt(character.maxHealth) && gym.health) {
          return {
            success: false,
            message: "Health is full not need go gym !"
          }
        }
        if (userById.power === parseInt(character.maxPower) && gym.power) {
          return {
            success: false,
            message: "Pow is full not need go gym !"
          }
        }
        if (userById.agility === parseInt(character.maxAgility) && gym.agility) {
          return {
            success: false,
            message: "Agility is full not need go gym !"
          }
        }
        if (userById.endurance === parseInt(character.maxEndurance) && gym.endurance) {
          return {
            success: false,
            message: "Endurance is full not need go gym !"
          }
        }
        let updateUser = await User.updateUser({
          userId,
          energy: gym.energy,
        });
        if (updateUser.success) {
          let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
          if (!isPending) {
            return {
              success: false,
              message: "Get gym is pending !"
            }
          }
          let result = await apiBtamin.payOrReward(userId, userToken, gym.btamin, userById.btamin);
          if (!result.success) {
            await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
            return result;
          }
          userById = updateUser.data;
          userById.btamin = result.btamin;
          userById.work = {
            workId,
            workType,
            startTime: Date.now()
          }
          await userById.save();
          await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
          return {
            data: {
              btamin: userById.btamin,
              energy: userById.energy,
              work: userById.work
            },
            success: true,
            message: "Get Gym successful !",
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
      case "School": {
        if (userById.intelligence === parseInt(character.maxIntelligence)) {
          return {
            success: false,
            message: "Intelligence is full not need go school !"
          }
        }
        let school = await School.findOne({ id: workId });
        if (!school) {
          return {
            success: false,
            message: "School not exist !"
          };
        }
        let updateUser = await User.updateUser({
          userId,
          energy: school.energy
        });
        if (updateUser.success) {
          let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
          if (!isPending) {
            return {
              success: false,
              message: "Get school is pending !"
            }
          }
          let result = await apiBtamin.payOrReward(userId, userToken, school.btamin, userById.btamin);
          if (!result.success) {
            await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
            return result;
          }
          userById = updateUser.data;
          userById.btamin = result.btamin;
          userById.work = {
            workId,
            workType,
            startTime: Date.now()
          }
          await userById.save();
          await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
          return {
            data: {
              btamin: userById.btamin,
              energy: userById.energy,
              work: userById.work
            },
            success: true,
            message: "Get School successful !",
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
    }
    return {
      success: false,
      message: "Work Type not exist !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function getIncomeWork(userId, userToken) {
  try {
    let userById = await User.findOne({ id: userId });
    if (!userById.work.workId) {
      return {
        success: false,
        message: "User is not working !"
      };
    }
    let workId = userById.work.workId;
    let workType = userById.work.workType;
    switch (workType) {
      case "Work": {
        let work = await Work.findOne({ id: workId });
        if (!work) {
          return {
            success: false,
            message: "Work not exist !"
          };
        }
        if (Date.now() - userById.work.startTime >= work.time) {
          let updateUser = await User.updateUser({
            userId,
            respect: work.respect
          });
          if (updateUser.success) {
            let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
            if (!isPending) {
              return {
                success: false,
                message: "Get Income work is pending !"
              }
            }
            let result = await apiBtamin.payOrReward(userId, userToken, work.income, userById.btamin);
            if (!result.success) {
              await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
              return result;
            }
            userById = updateUser.data;
            userById.btamin = result.btamin;
            userById.work = {
              "workId": 0,
              "workType": "",
              "startTime": 0
            };
            userById.income += work.income;
            await userById.save();
            await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
            return {
              data: {
                btamin: userById.btamin,
                level: userById.level,
                respect: userById.respect,
                work: userById.work,
                income: userById.income
              },
              success: true,
              message: "Get income Work successful !",
              workId: workId,
              workType: workType,
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
            message: "Work not enough time to get income !"
          };
        }
      }
      case "Hospital": {
        let hospital = await Hospital.findOne({ id: workId });
        if (!hospital) {
          return {
            success: false,
            message: "Hospital not exist !"
          };
        }
        if (Date.now() - userById.work.startTime >= hospital.time) {
          let updateUser = await User.updateUser({
            userId,
            health: hospital.health
          });
          if (updateUser.success) {
            userById = updateUser.data;
            userById.work = {
              "workId": 0,
              "workType": "",
              "startTime": 0
            };
            await userById.save();
            return {
              data: {
                health: userById.health,
                work: userById.work
              },
              success: true,
              message: "Get income Hospital successful !",
              workId: workId,
              workType: workType,
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
            message: "Hospital not enough time to get income !"
          };
        }
      }
      case "Gym": {
        let gym = await Gym.findOne({ id: workId });
        if (!gym) {
          return {
            success: false,
            message: "Gym not exist !"
          };
        }
        if (Date.now() - userById.work.startTime >= gym.time) {
          let updateUser = await User.updateUser({
            userId,
            respect: gym.respect,
            health: gym.health,
            power: gym.power,
            agility: gym.agility,
            endurance: gym.endurance
          });
          if (updateUser.success) {
            userById = updateUser.data;
            userById.work = {
              "workId": 0,
              "workType": "",
              "startTime": 0
            };
            await userById.save();
            return {
              data: {
                level: userById.level,
                respect: userById.respect,
                health: userById.health,
                power: userById.power,
                agility: userById.agility,
                endurance: userById.endurance,
                work: userById.work
              },
              success: true,
              message: "Get income Gym successful !",
              workId: workId,
              workType: workType,
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
            message: "Gym not enough time to get income !"
          };
        }
      }
      case "School": {
        let school = await School.findOne({ id: workId });
        if (!school) {
          return {
            success: false,
            message: "School not exist !"
          };
        }
        if (Date.now() - userById.work.startTime >= school.time) {
          let updateUser = await User.updateUser({
            userId,
            respect: school.respect,
            intelligence: school.intelligence
          });
          if (updateUser.success) {
            userById = updateUser.data;
            userById.work = {
              "workId": 0,
              "workType": "",
              "startTime": 0
            };
            await userById.save();
            return {
              data: {
                level: userById.level,
                respect: userById.respect,
                intelligence: userById.intelligence,
                work: userById.work
              },
              success: true,
              message: "Get income School successful !",
              workId: workId,
              workType: workType
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
            message: "School not enough time to get income !"
          };
        }
      }
    }
    return {
      success: false,
      message: "Work Type not exist !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function cancelWork(userId) {
  try {
    let userById = await User.findOne({ id: userId });
    let workId = userById.work.workId;
    let workType = userById.work.workType;
    userById.work = {
      "workId": 0,
      "workType": "",
      "startTime": 0
    };
    await userById.save();
    return {
      data: {
        work: userById.work
      },
      success: true,
      message: "Cancel work successful !",
      workId: workId,
      workType: workType
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function changeMainVehicle(userId, vehicleId, vehicleType) {
  try {
    let userById = await User.findOne({ id: userId });
    if (userById.mainVehicle.vehicleId === vehicleId && userById.mainVehicle.vehicleType === vehicleType) {
      return {
        success: false,
        message: "Main vehicle is this !"
      };
    }
    let vehicle;
    switch (vehicleType) {
      case "RoadVehicle": {
        vehicle = userById.roadvehicles.find(e => e.id === vehicleId);
        if (!vehicle) {
          return {
            success: false,
            message: "User not have this road vehicle !"
          };
        }
        break;
      }
      case "Plane": {
        vehicle = userById.planes.find(e => e.id === vehicleId);
        if (!vehicle) {
          return {
            success: false,
            message: "User not have this plane !"
          };
        }
        break;
      }
      case "Boat": {
        vehicle = userById.boats.find(e => e.id === vehicleId);
        if (!vehicle) {
          return {
            success: false,
            message: "User not have this boat !"
          };
        }
        break;
      }
      default: {
        return {
          success: false,
          message: "Vehicle type not exist !"
        };
      }
    }
    userById.mainVehicle = {
      vehicleId,
      vehicleType
    }
    await userById.save();
    return {
      data: {
        mainVehicle: userById.mainVehicle
      },
      success: true,
      message: "Change main vehicle successful !"
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function racingVehicle(userId, userToken, vehicleId, vehicleType) {
  try {
    let userById = await User.findOne({ id: userId });
    if (userById.work.workId) {
      return {
        success: false,
        message: "User is go to " + userById.work.workType
      };
    }
    var rival = await findRival(userId, "Racing");
    if (!rival) {
      return {
        success: false,
        message: "Not found the rival !"
      };
    }
    let vehicleUser = await getVehicleUser(userById, vehicleId, vehicleType);
    if (!vehicleUser) {
      return {
        success: false,
        message: "User not have this vehicle !"
      };
    }
    let vehicleRival = await getMainVehicle(rival);
    if (!vehicleRival) {
      return {
        success: false,
        message: "Rival not have main vehicle !"
      };
    }
    delete vehicleUser['_id'];
    delete vehicleRival['_id'];
    let score = 0;
    if (vehicleUser.speed.current_speed > vehicleRival.speed.current_speed) {
      score++;
    }
    if (vehicleUser.speed.current_speed < vehicleRival.speed.current_speed) {
      score--;
    }
    if (vehicleUser.acceleration.current_acceleration > vehicleRival.acceleration.current_acceleration) {
      score++;
    }
    if (vehicleUser.acceleration.current_acceleration < vehicleRival.acceleration.current_acceleration) {
      score--;
    }
    if (vehicleUser.stability.current_stability > vehicleRival.stability.current_stability) {
      score++;
    }
    if (vehicleUser.stability.current_stability < vehicleRival.stability.current_stability) {
      score--;
    }
    let updateUser;
    let resultRacing;
    let result;
    if (score > 0) {
      resultRacing = 'win';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(racingUser.respectRacingWin),
        energy: parseInt(racingUser.energyRacing)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Racing vehicle is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(racingUser.btaminRacingWin), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.income += parseInt(racingUser.btaminRacingWin);
        userById.race++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    if (score === 0) {
      resultRacing = 'draw';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(racingUser.respectRacingDraw),
        energy: parseInt(racingUser.energyRacing)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Racing vehicle is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(racingUser.btaminRacingDraw), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.race++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    if (score < 0) {
      resultRacing = 'lost';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(racingUser.respectRacingLost),
        energy: parseInt(racingUser.energyRacing)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Racing vehicle is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(racingUser.btaminRacingLost), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.race++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    return {
      data: {
        btamin: userById.btamin,
        respect: userById.respect,
        energy: userById.energy,
        user: {
          id: userById.id,
          vehicle: vehicleUser
        },
        rival: {
          id: rival.id,
          vehicle: vehicleRival
        },
        result: resultRacing,
        race: userById.race,
        income: userById.income
      },
      success: true,
      message: "Racing Vehicle Successful !",
      reqData: result.reqData,
      resData: result.resData
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function fight(userId, userToken) {
  try {
    let userById = await User.findOne({ id: userId });
    if (userById.work.workId) {
      return {
        success: false,
        message: "User is go to " + userById.work.workType
      };
    }
    var rival = await findRival(userId, "Fight");
    if (!rival) {
      return {
        success: false,
        message: "Not found the rival !"
      };
    }
    let score = 0;
    if (userById.power > rival.power) {
      score++;
    }
    if (userById.power < rival.power) {
      score--;
    }
    if (userById.agility > rival.agility) {
      score++;
    }
    if (userById.agility < rival.agility) {
      score--;
    }
    if (userById.endurance > rival.endurance) {
      score++;
    }
    if (userById.endurance < rival.endurance) {
      score--;
    }
    if (userById.intelligence > rival.intelligence) {
      score++;
    }
    if (userById.intelligence < rival.intelligence) {
      score--;
    }
    let updateUser;
    let resultFight;
    let result;
    if (score > 0) {
      resultFight = 'win';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(fightUser.respectFightWin),
        health: parseInt(fightUser.healthFight),
        energy: parseInt(fightUser.energyFight)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Fight is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(fightUser.btaminFightWin), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.income += parseInt(fightUser.btaminFightWin);
        userById.fight++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    if (score === 0) {
      resultFight = 'draw';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(fightUser.respectFightDraw),
        health: parseInt(fightUser.healthFight),
        energy: parseInt(fightUser.energyFight)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Fight is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(fightUser.btaminFightDraw), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.fight++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    if (score < 0) {
      resultFight = 'lost';
      updateUser = await User.updateUser({
        userId,
        respect: parseInt(fightUser.respectFightLost),
        health: parseInt(fightUser.healthFight),
        energy: parseInt(fightUser.energyFight)
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Fight is pending !"
          }
        }
        result = await apiBtamin.payOrReward(userId, userToken, parseInt(fightUser.btaminFightLost), userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        userById.fight++;
        userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      } else {
        return {
          success: false,
          message: updateUser.message
        }
      }
    }
    return {
      data: {
        btamin: userById.btamin,
        respect: userById.respect,
        health: userById.health,
        energy: userById.energy,
        user: {
          id: userById.id,
          power: userById.power,
          agility: userById.agility,
          endurance: userById.endurance,
          intelligence: userById.intelligence
        },
        rival: {
          id: rival.id,
          value_character: rival.value_character,
          power: rival.power,
          agility: rival.agility,
          endurance: rival.endurance,
          intelligence: rival.intelligence,
          usedItems: rival.usedItems
        },
        result: resultFight,
        fight: userById.fight,
        income: userById.income
      },
      success: true,
      message: "Fight Successful !",
      reqData: result.reqData,
      resData: result.resData
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function getTopUser(request) {
  try {
    let querySearch = {};
    if (request.search) {
      querySearch = { id: { $regex: request.search, $options: 'i' } };
    }
    let queryIsOnline = {};
    // console.log('request: ', request);
    if (request.isOnline === true || request.isOnline === false) {
      queryIsOnline = { isOnline: request.isOnline };
    }
    let query = {
      $and: [
        querySearch,
        queryIsOnline
      ]
    }
    let select = ["-_id", "id", "respect", "btamin", "level", "usedItems", "mainVehicle", "power", "agility",
      "endurance", "intelligence", "health", "energy", "fight", "race", "properties", "income", "value_character",
      "home_id", "garage_id", "hangar_id", "quays_id", "pets"];
    let users = await User.find(query).sort(request.sort).skip(request.skip).limit(request.limit).select(select);
    return users;
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function findRival(userId, typeFind) {
  try {
    switch (typeFind) {
      case "Racing": {
        var query = [
          {
            $match: {
              $and: [
                { id: { $ne: userId } },
                { "mainVehicle.vehicleId": { $ne: 0 } }
              ]
            }
          },
          { $sample: { size: 1 } },
        ];
        let rival = await User.aggregate(query);
        return rival[0];
      }
      case "Fight": {
        var query = [
          {
            $match: {
              $and: [
                { id: { $ne: userId } }
              ]
            }
          },
          { $sample: { size: 1 } },
        ];
        let rival = await User.aggregate(query);
        return rival[0];
      }
      default: {
        return null;
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

async function getVehicleUser(userById, vehicleId, vehicleType) {
  let vehicle;
  switch (vehicleType) {
    case "RoadVehicle": {
      vehicle = await userById.roadvehicles.find(e => e.id === vehicleId);
      return vehicle;
    }
    case "Plane": {
      vehicle = await userById.planes.find(e => e.id === vehicleId);
      return vehicle;
    }
    case "Boat": {
      vehicle = await userById.boats.find(e => e.id === vehicleId);
      return vehicle;
    }
    default: {
      return vehicle;
    }
  }
}

async function getMainVehicle(userById) {
  let vehicle;
  if (!userById.mainVehicle) {
    return vehicle;
  }
  let vehicleId = userById.mainVehicle.vehicleId;
  let vehicleType = userById.mainVehicle.vehicleType;
  switch (vehicleType) {
    case "RoadVehicle": {
      vehicle = await userById.roadvehicles.find(e => e.id === vehicleId);
      return vehicle;
    }
    case "Plane": {
      vehicle = await userById.planes.find(e => e.id === vehicleId);
      return vehicle;
    }
    case "Boat": {
      vehicle = await userById.boats.find(e => e.id === vehicleId);
      return vehicle;
    }
    default: {
      return vehicle;
    }
  }
}

module.exports = {
  getUser,
  getHome,
  chooseCharacter,
  getWork,
  getIncomeWork,
  cancelWork,
  changeMainVehicle,
  racingVehicle,
  fight,
  getTopUser
}