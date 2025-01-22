const bcrypt = require("bcryptjs");
const Messages = require("../constants/Message");
const TryCatch = require("../helper/TryCatch");
const { ObjectId } = require('mongodb');
const donorsCollection = require("../db").db().collection("donor");

let Donor = function (data) {
  this.data = data;
  this.errors = [];
};

Donor.prototype.cleanUp = function () {
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
    role: "donor",
    createdAt: new Date(),
//predefined end

  };
};

Donor.prototype.login = async function () {
  let attemptedUser = await donorsCollection.findOne({ email: this.data.email });
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

Donor.prototype.register =async function  () {
    this.cleanUp();
 
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await donorsCollection.insertOne(this.data);
      return true
    
};

Donor.prototype.findByEmail = async function (email) {
  let donorDoc = await donorsCollection.findOne({ email: email })
  return donorDoc
     
};

Donor.prototype.doesEmailExist = async function (email) {
 
    let donor = await donorsCollection.findOne({ email: email });
    if (donor) {
      return true;
    } else {
      return false;
    }
  }

Donor.prototype.getById = async function (id){
  let donorDoc = await donorsCollection.findOne({_id: new ObjectId(id)})
  return donorDoc
}

Donor.prototype.updateById = async function (id, data) {
  let donorDoc = await donorsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: data.name,
        lName: data.lName,
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address,
        city: data.city,
        role: "donor",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  return donorDoc;
};

Donor.prototype.updateByEmail = async function (email, data) {
  let donorDoc = await donorsCollection.findOneAndUpdate(
    { email: email },
    {
      $set: {
        name: data.name,
        lName: data.lName,
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address,
        city: data.city,
        role: "donor",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  return donorDoc;
};


Donor.prototype.getAllDonors = async function (){
  let donorDoc = await donorsCollection.find({}).toArray()
  return donorDoc
}

Donor.prototype.deleteById = async function (id){
 await donorsCollection.deleteOne({_id: new ObjectId(id)})
  return 
}

module.exports = Donor;