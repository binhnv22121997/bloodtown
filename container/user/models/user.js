var mongoose = require('mongoose');
var Level = require('../../level/models/level');
var character = require('../../../config/character');

var UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  power: {
    type: Number,
    default: 0
  },
  agility: {
    type: Number,
    default: 0
  },
  endurance: {
    type: Number,
    default: 0
  },
  intelligence: {
    type: Number,
    default: 0
  },
  character: {
    type: Boolean,
    default: false
  },
  health: {
    type: Number,
    default: 100
  },
  energy: {
    type: Number,
    default: 100
  },
  btamin: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  respect: {
    type: Number,
    default: 0
  },
  fight: {
    type: Number,
    default: 0
  },
  race: {
    type: Number,
    default: 0
  },
  properties: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  },
  value_character: {
    type: Number,
    default: 0
  },
  home_id: {
    type: Number,
    default: 1
  },
  garage_id: {
    type: Number,
    default: 0
  },
  hangar_id: {
    type: Number,
    default: 0
  },
  quays_id: {
    type: Number,
    default: 0
  },
  bank: {
    type: Number,
    default: 0
  },
  pets: {
    type: [Number]
  },
  items: {
    type: [Number]
  },
  usedItems: {
    shirtId: {
      type: Number,
      default: 0
    },
    trousersId: {
      type: Number,
      default: 0
    },
    hatsId: {
      type: Number,
      default: 0
    },
    shoesId: {
      type: Number,
      default: 0
    },
    armorialId: {
      type: Number,
      default: 0
    },
    weaponsId: {
      type: Number,
      default: 0
    }
  },
  roadvehicles: [{
    _id: false,
    id: Number,
    btamin_sell: Number,
    vehicleType: String,
    speed: {
      current_speed: Number,
      index: Number,
    },
    acceleration: {
      current_acceleration: Number,
      index: Number,
    },
    stability: {
      current_stability: Number,
      index: Number,
    },
  }],
  planes: [{
    _id: false,
    id: Number,
    btamin_sell: Number,
    vehicleType: String,
    speed: {
      current_speed: Number,
      index: Number,
    },
    acceleration: {
      current_acceleration: Number,
      index: Number,
    },
    stability: {
      current_stability: Number,
      index: Number,
    },
  }],
  boats: [{
    _id: false,
    id: Number,
    btamin_sell: Number,
    vehicleType: String,
    speed: {
      current_speed: Number,
      index: Number,
    },
    acceleration: {
      current_acceleration: Number,
      index: Number,
    },
    stability: {
      current_stability: Number,
      index: Number,
    },
  }],
  mainVehicle: {
    vehicleId: {
      type: Number,
      default: 0
    },
    vehicleType: {
      type: String,
      default: ''
    },
  },
  usedProperties: [{
    _id: false,
    propertyId: Number,
    startTime: Number
  }],
  work: {
    workId: {
      type: Number,
      default: 0
    },
    workType: {
      type: String,
      default: ''
    },
    startTime: {
      type: Number,
      default: 0
    },
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String,
    default: ''
  },
  isPending: {
    type: Boolean,
    default: false
  },
  vip: {
    type: String,
    default: 'No'
  }
});

UserSchema.statics.updateUser = async function ({ userId, respect = 0,
  health = 0, energy = 0, power = 0, agility = 0, endurance = 0, intelligence = 0 }) {
  var userById = await User.findOne({ id: userId });
  if (userById.respect < 0) {
    userById.respect = 0;
  }
  if (userById.health < 0) {
    userById.health = 0;
  }
  if (userById.energy < 0) {
    userById.energy = 0;
  }
  if (userById.power < 0) {
    userById.power = 0;
  }
  if (userById.agility < 0) {
    userById.agility = 0;
  }
  if (userById.endurance < 0) {
    userById.endurance = 0;
  }
  if (userById.intelligence < 0) {
    userById.intelligence = 0;
  }
  userById.respect += respect;
  if (userById.respect > parseInt(character.maxRespect)) {
    userById.respect = parseInt(character.maxRespect);
  }
  userById.level = await levelUp(userById.respect);
  if (userById.health + health < 0) {
    return {
      success: false,
      message: "User not enough health !"
    };
  } else {
    userById.health += health;
    if (userById.health > parseInt(character.maxHealth)) {
      userById.health = parseInt(character.maxHealth);
    }
  }
  if (userById.energy + energy < 0) {
    return {
      success: false,
      message: "User not enough energy !"
    };
  } else {
    userById.energy += energy;
    if (userById.energy > parseInt(character.maxEnergy)) {
      userById.energy = parseInt(character.maxEnergy);
    }
  }
  if (userById.power + power < 0) {
    return {
      success: false,
      message: "User not enough power !"
    };
  } else {
    userById.power += power;
    if (userById.power > parseInt(character.maxPower)) {
      userById.power = parseInt(character.maxPower);
    }
  }
  if (userById.agility + agility < 0) {
    return {
      success: false,
      message: "User not enough agility !"
    };
  } else {
    userById.agility += agility;
    if (userById.agility > parseInt(character.maxAgility)) {
      userById.agility = parseInt(character.maxAgility);
    }
  }
  if (userById.endurance + endurance < 0) {
    return {
      success: false,
      message: "User not enough endurance !"
    };
  } else {
    userById.endurance += endurance;
    if (userById.endurance > parseInt(character.maxEndurance)) {
      userById.endurance = parseInt(character.maxEndurance);
    }
  }
  if (userById.intelligence + intelligence < 0) {
    return {
      success: false,
      message: "User not enough intelligence !"
    };
  } else {
    userById.intelligence += intelligence;
    if (userById.intelligence > parseInt(character.maxIntelligence)) {
      userById.intelligence = parseInt(character.maxIntelligence);
    }
  }
  return {
    data: userById,
    success: true,
    message: ""
  };
}

async function levelUp(respect) {
  if (respect < 0) {
    return 1;
  }
  var levelUp = await Level.findOne({
    respect: { $gte: respect }
  }).sort({ 'level': 1 });
  if (!levelUp) {
    var levelUp = await Level.findOne({}).sort({ 'level': -1 });
  }
  return levelUp.level;
}

var User = mongoose.model('User', UserSchema);
module.exports = User;

