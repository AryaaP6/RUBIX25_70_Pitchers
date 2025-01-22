const Messages = require("../constants/Message");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const Donor = require("../models/Donor");
const jwt = require("jsonwebtoken");


// how long a token lasts before expiring
const tokenLasts = "365d";


//LOGIN
exports.apiLogin = async function (req, res) {
  let donor = new Donor(req.body);

  let result = await donor.login();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: donor.data._id, name: donor.data.name, email: donor.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: donor.data._id,
      name: donor.data.name,
      role: "donor",
    };

    new JsonResponse(req, res).jsonSuccess(data, "Login success");
  } else {
    res.locals.data = {
      isValid: false,
      loginFailed: true,
    };
    res.locals.message = new Messages().INVALID_CREDENTIALS;
    new JsonResponse(req, res).jsonError();
  }
};

//REGISTER
exports.apiRegister = async function (req, res) {
  let donor = new Donor(req.body);
  console.log(req.body);

  let result = await donor.register();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: donor.data._id, name: donor.data.fName, email: donor.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: donor.data._id,
      name: donor.data.name,
      role: "donor",
    };
    new JsonResponse(req, res).jsonSuccess(data, "Register success");
  } else {
    res.locals.data = {
      isVaild: false,
      authorizationFailed: true,
    };
    res.locals.message = regErrors;
    new JsonResponse(req, res).jsonError();
  }
};

//Donor Exists?
exports.doesEmailExist = async function (req, res) {
  // throw new Error("This is a dummy exception for testing");
  console.log(Donor.doesEmailExist(req.body.email));
  let emailBool = await Donor.doesEmailExist(req.body.email);
  new JsonResponse(req, res).jsonSuccess(
    emailBool,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};



exports.getById = async function(req, res){
  let donor = new Donor()
  let donorDoc = await donor.getById(req.params.id)
  new JsonResponse(req, res).jsonSuccess(donorDoc, new Messages().SUCCESSFULLY_RECEIVED)

}

exports.getByEmail = async function(req, res){
  let donor = new Donor()
  let donorDoc = await donor.findByEmail(req.params.email)
  console.log(donorDoc)
  new JsonResponse(req, res).jsonSuccess(donorDoc, new Messages().SUCCESSFULLY_RECEIVED)
}

exports.updateById = async function (req, res) {
  let donor = new Donor();
  let donorDoc = await donor.updateById(req.params.id, req.body);
  new JsonResponse(req, res).jsonSuccess(donorDoc, new Messages().SUCCESSFULLY_UPDATED);
};

exports.updateByEmail = async function (req, res) {
  let donor = new Donor();
  let donorDoc = await donor.updateByEmail(req.params.email, req.body);
  new JsonResponse(req, res).jsonSuccess(donorDoc, new Messages().SUCCESSFULLY_UPDATED);
};


exports.getAllDonors = async function(req, res){
  let donor = new Donor()
  let donors = await donor.getAllDonors()
  new JsonResponse(req, res).jsonSuccess(donors, new Messages().SUCCESSFULLY_RECEIVED)
  return donors
}

exports.deleteById= async function(req, res){
 let donor = new Donor();
 await donor.deleteById()
 new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}