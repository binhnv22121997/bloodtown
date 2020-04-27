var Item = require('../item/models/item');
var User = require('../../user/models/user');
var apiBtamin = require('../../apiBtamin');
var character = require('../../../config/character');

async function getAll() {
  return await Item.find({}).sort({ id: 1 });
}

async function useItem(userId, itemId) {
  try {
    let userById = await User.findOne({ id: userId });
    let userItems = userById.items;
    if (userItems.indexOf(itemId) === -1) {
      return {
        success: false,
        message: "User not have item !"
      };
    }
    let userUsedItems = userById.usedItems;
    let newUserUsedItems = await updateItem(userUsedItems, itemId, userId, true);
    if (newUserUsedItems.success) {
      userById = await User.findOne({ id: userId });
      userById.usedItems = newUserUsedItems.data;
      await userById.save();
      return {
        data: {
          usedItems: userById.usedItems,
          endurance: userById.endurance,
          intelligence: userById.intelligence,
          power: userById.power,
          agility: userById.agility
        },
        success: true,
        message: "Use item successful !"
      };
    } else {
      return newUserUsedItems;
    }
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function unUseItem(userId, itemId) {
  try {
    let userById = await User.findOne({ id: userId });
    let userItems = userById.items;
    if (userItems.indexOf(itemId) === -1) {
      return {
        success: false,
        message: "User not have item !"
      };
    }
    userUsedItems = userById.usedItems;
    let newUserUsedItems = await updateItem(userUsedItems, itemId, userId, false);
    if (newUserUsedItems.success) {
      userById = await User.findOne({ id: userId });
      userById.usedItems = newUserUsedItems.data;
      await userById.save();
      return {
        data: {
          usedItems: userById.usedItems,
          endurance: userById.endurance,
          intelligence: userById.intelligence,
          power: userById.power,
          agility: userById.agility,
        },
        success: true,
        message: "UnUse item successful !"
      };
    } else {
      return updateItem;
    }
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function buyItem(userId, userToken, itemId) {
  try {
    let userById = await User.findOne({ id: userId });
    let item = await Item.findOne({ id: itemId });
    if (!item) {
      return {
        success: false,
        message: "Item not exist !"
      };
    }
    if (userById.level < item.min_level) {
      return {
        success: false,
        message: "User not enough level !"
      };
    }
    if (item.type === 'FOODS') {
      if (userById.energy === parseInt(character.maxEnergy)) {
        return {
          success: false,
          message: "Energy have full !"
        };
      }
      var updateUser = await User.updateUser({
        userId,
        energy: item.energy
      });
      if (updateUser.success) {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Buy Food is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, item.btamin, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById = updateUser.data;
        userById.btamin = result.btamin;
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            btamin: userById.btamin,
            energy: userById.energy,
          },
          success: true,
          message: "Buy and use Food successful !",
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
    if (userById.items.indexOf(itemId) === -1) {
      if (!checkCharacter(userById.value_character, item.value)) {
        return {
          success: false,
          message: "Item gender incorrect !"
        };
      }
      let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
      if (!isPending) {
        return {
          success: false,
          message: "Buy item is pending !"
        }
      }
      let result = await apiBtamin.payOrReward(userId, userToken, item.btamin, userById.btamin);
      if (!result.success) {
        await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
        return result;
      }
      userById.btamin = result.btamin;
      userById.items.push(itemId);
      await userById.save();
      await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
      return {
        data: {
          btamin: userById.btamin,
          items: userById.items
        },
        success: true,
        message: "Buy item successful !",
        reqData: result.reqData,
        resData: result.resData
      };
    } else {
      return {
        success: false,
        message: "Item exist in user items !"
      };
    }
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function sellItem(userId, userToken, itemId) {
  try {
    let userById = await User.findOne({ id: userId });
    let item = await Item.findOne({ id: itemId });
    if (!item) {
      return {
        success: false,
        message: "Item not exist !"
      };
    }
    if (item.type === 'FOODS') {
      return {
        success: false,
        message: "Can not sell Food !"
      };
    }
    if (userById.items.indexOf(itemId) !== -1) {
      let isUsing;
      isUsing = await checkIsUsingItem(userById, itemId);
      if (isUsing) {
        return {
          success: false,
          message: "Can not sell the using item !"
        };
      } else {
        let isPending = await User.findOneAndUpdate({ id: userId, isPending: false }, { isPending: true }, { new: true });
        if (!isPending) {
          return {
            success: false,
            message: "Sell item is pending !"
          }
        }
        let result = await apiBtamin.payOrReward(userId, userToken, item.btamin_sell, userById.btamin);
        if (!result.success) {
          await User.findOneAndUpdate({ id: userId }, { isPending: false, btamin: result.btamin }, { new: true });
          return result;
        }
        userById.btamin = result.btamin;
        userById.items = userById.items.filter(e => e !== itemId);
        await userById.save();
        await User.findOneAndUpdate({ id: userId }, { isPending: false }, { new: true });
        return {
          data: {
            btamin: userById.btamin,
            items: userById.items
          },
          success: true,
          message: "Sell item successful !",
          reqData: result.reqData,
          resData: result.resData
        };
      }
    } else {
      return {
        success: false,
        message: "Item not exist in user items !"
      };
    }
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

async function updateItem(userUsedItems, itemId, userId, isUse) {
  try {
    let type = await Item.getTypeItem(itemId);
    let oldItem;
    let newItem;
    switch (type) {
      case "SHIRT": {
        if (isUse) {
          if (userUsedItems.shirtId) {
            oldItem = await Item.findOne({ id: userUsedItems.shirtId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.shirtId = itemId;
        } else {
          if (userUsedItems.shirtId) {
            oldItem = await Item.findOne({ id: userUsedItems.shirtId });
          }
          userUsedItems.shirtId = 0;
        }
        break;
      }
      case "TROUSERS": {
        if (isUse) {
          if (userUsedItems.trousersId) {
            oldItem = await Item.findOne({ id: userUsedItems.trousersId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.trousersId = itemId;
        } else {
          if (userUsedItems.trousersId) {
            oldItem = await Item.findOne({ id: userUsedItems.trousersId });
          }
          userUsedItems.trousersId = 0;
        }
        break;
      }
      case "HATS": {
        if (isUse) {
          if (userUsedItems.hatsId) {
            oldItem = await Item.findOne({ id: userUsedItems.hatsId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.hatsId = itemId;
        } else {
          if (userUsedItems.hatsId) {
            oldItem = await Item.findOne({ id: userUsedItems.hatsId });
          }
          userUsedItems.hatsId = 0;
        }
        break;
      }
      case "SHOES": {
        if (isUse) {
          if (userUsedItems.shoesId) {
            oldItem = await Item.findOne({ id: userUsedItems.shoesId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.shoesId = itemId;
        } else {
          if (userUsedItems.shoesId) {
            oldItem = await Item.findOne({ id: userUsedItems.shoesId });
          }
          userUsedItems.shoesId = 0;
        }
        break;
      }
      case "ARMORIAL": {
        if (isUse) {
          if (userUsedItems.armorialId) {
            oldItem = await Item.findOne({ id: userUsedItems.armorialId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.armorialId = itemId;
        } else {
          if (userUsedItems.armorialId) {
            oldItem = await Item.findOne({ id: userUsedItems.armorialId });
          }
          userUsedItems.armorialId = 0;
        }
        break;
      }
      case "WEAPONS": {
        if (isUse) {
          if (userUsedItems.weaponsId) {
            oldItem = await Item.findOne({ id: userUsedItems.weaponsId });
          }
          if (itemId) {
            newItem = await Item.findOne({ id: itemId });
          }
          userUsedItems.weaponsId = itemId;
        } else {
          if (userUsedItems.weaponsId) {
            oldItem = await Item.findOne({ id: userUsedItems.weaponsId });
          }
          userUsedItems.weaponsId = 0;
        }
        break;
      }
    }
    if (isUse) {
      if (oldItem) {
        var updateUser = await User.updateUser({
          userId,
          power: -oldItem.power,
          agility: -oldItem.agility,
          endurance: -oldItem.endurance,
          intelligence: -oldItem.intelligence
        });
        if (updateUser.success) {
          await updateUser.data.save();
        } else {
          return {
            success: false,
            message: updateUser.message
          };
        }
      }
      if (newItem) {
        var updateUser = await User.updateUser({
          userId,
          power: newItem.power,
          agility: newItem.agility,
          endurance: newItem.endurance,
          intelligence: newItem.intelligence
        });
        if (updateUser.success) {
          await updateUser.data.save();
        } else {
          return {
            success: false,
            message: updateUser.message
          };
        }
      }
    } else {
      if (oldItem) {
        var updateUser = await User.updateUser({
          userId,
          power: -oldItem.power,
          agility: -oldItem.agility,
          endurance: -oldItem.endurance,
          intelligence: -oldItem.intelligence
        });
        if (updateUser.success) {
          await updateUser.data.save();
        } else {
          return {
            success: false,
            message: updateUser.message
          };
        }
      }
    }
    return {
      data: userUsedItems,
      success: true,
    };
  } catch (e) {
    console.log("Error :", e);
    return {
      success: false,
      message: e
    }
  }
}

function checkCharacter(value_character, value_item) {
  if (value_item === 0) {
    return true;
  } else {
    if (value_character === value_item) {
      return true;
    } else {
      return false;
    }
  }
}

async function checkIsUsingItem(userById, itemId) {
  try {
    let isUsing;
    let type = await Item.getTypeItem(itemId);
    switch (type) {
      case "SHIRT": {
        if (userById.usedItems.shirtId === itemId) {
          isUsing = true;
        }
        break;
      }
      case "TROUSERS": {
        if (userById.usedItems.trousersId === itemId) {
          isUsing = true;
        }
        break;
      }
      case "HATS": {
        if (userById.usedItems.hatsId === itemId) {
          isUsing = true;
        }
        break;
      }
      case "SHOES": {
        if (userById.usedItems.shoesId === itemId) {
          isUsing = true;
        }
        break;
      }
      case "ARMORIAL": {
        if (userById.usedItems.armorialId === itemId) {
          isUsing = true;
        }
        break;
      }
      case "WEAPONS": {
        if (userById.usedItems.weaponsId === itemId) {
          isUsing = true;
        }
        break;
      }
    }
    return isUsing;
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
  useItem,
  unUseItem,
  buyItem,
  sellItem
};