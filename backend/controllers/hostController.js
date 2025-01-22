const Messages = require("../constants/Message");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const Host = require("../models/Host");
const jwt = require("jsonwebtoken");


// how long a token lasts before expiring
const tokenLasts = "365d";


//LOGIN
exports.apiLogin = async function (req, res) {
  let host = new Host(req.body);

  let result = await host.login();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: host.data._id, name: host.data.name, email: host.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: host.data._id,
      name: host.data.name,
      role: "host",
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
  let host = new Host(req.body);
  console.log(req.body);

  let result = await host.register();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: host.data._id, name: host.data.fName, email: host.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: host.data._id,
      name: host.data.name,
      role: "host",
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

//Host Exists?
exports.doesEmailExist = async function (req, res) {
  // throw new Error("This is a dummy exception for testing");
  console.log(Host.doesEmailExist(req.body.email));
  let emailBool = await Host.doesEmailExist(req.body.email);
  new JsonResponse(req, res).jsonSuccess(
    emailBool,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};



exports.getById = async function(req, res){
  let host = new Host()
  let hostDoc = await host.getById(req.params.id)
  new JsonResponse(req, res).jsonSuccess(hostDoc, new Messages().SUCCESSFULLY_RECEIVED)

}

exports.getByEmail = async function(req, res){
  let host = new Host()
  let hostDoc = await host.findByEmail(req.params.email)
  console.log(hostDoc)
  new JsonResponse(req, res).jsonSuccess(hostDoc, new Messages().SUCCESSFULLY_RECEIVED)
}

exports.updateById = async function (req, res) {
  let host = new Host();
  let hostDoc = await host.updateById(req.params.id, req.body);
  new JsonResponse(req, res).jsonSuccess(hostDoc, new Messages().SUCCESSFULLY_UPDATED);
};

exports.updateByEmail = async function (req, res) {
  let host = new Host();
  let hostDoc = await host.updateByEmail(req.params.email, req.body);
  new JsonResponse(req, res).jsonSuccess(hostDoc, new Messages().SUCCESSFULLY_UPDATED);
};


exports.getAllHosts = async function(req, res){
  let host = new Host()
  let hosts = await host.getAllHosts()
  new JsonResponse(req, res).jsonSuccess(hosts, new Messages().SUCCESSFULLY_RECEIVED)
  return hosts
}

exports.deleteById= async function(req, res){
 let host = new Host();
 await host.deleteById()
 new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}