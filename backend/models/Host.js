const bcrypt = require("bcryptjs");
const Messages = require("../constants/Message");
const TryCatch = require("../helper/TryCatch");
const { ObjectId } = require('mongodb');
const hostsCollection = require("../db").db().collection("host");

let Host = function (data) {
  this.data = data;
  this.errors = [];
};

Host.prototype.cleanUp = function () {
  // get rid of any bogus properties
  this.data = {
    //predfined start
    name: this.data.name,
    lName: this.data.lName,
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
    contactNumber: this.data.contactNumber,
    address: this.data.address,
    city: this.data.city,
    role: "host",
    createdAt: new Date(),
//predefined end

  };
};

Host.prototype.login = async function () {
  let attemptedUser = await hostsCollection.findOne({ email: this.data.email });
  this.cleanUp();
  if (
    attemptedUser &&
    bcrypt.compareSync(this.data.password, attemptedUser.password)
  ) {
    this.data = attemptedUser;
    return true;
  } else {
    return false;
  }
};

Host.prototype.register =async function  () {
    this.cleanUp();
 
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await hostsCollection.insertOne(this.data);
      return true
    
};

Host.prototype.findByEmail = async function (email) {
  let hostDoc = await hostsCollection.findOne({ email: email })
  return hostDoc
     
};

Host.prototype.doesEmailExist = async function (email) {
 
    let host = await hostsCollection.findOne({ email: email });
    if (host) {
      return true;
    } else {
      return false;
    }
  }

Host.prototype.getById = async function (id){
  let hostDoc = await hostsCollection.findOne({_id: new ObjectId(id)})
  return hostDoc
}

Host.prototype.updateById = async function (id, data) {
  let hostDoc = await hostsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: data.name,
        lName: data.lName,
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address,
        city: data.city,
        role: "host",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  return hostDoc;
};

Host.prototype.updateByEmail = async function (email, data) {
  let hostDoc = await hostsCollection.findOneAndUpdate(
    { email: email },
    {
      $set: {
        name: data.name,
        lName: data.lName,
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address,
        city: data.city,
        role: "host",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  return hostDoc;
};


Host.prototype.getAllHosts = async function (){
  let hostDoc = await hostsCollection.find({}).toArray()
  return hostDoc
}

Host.prototype.deleteById = async function (id){
 await hostsCollection.deleteOne({_id: new ObjectId(id)})
  return 
}

module.exports = Host;