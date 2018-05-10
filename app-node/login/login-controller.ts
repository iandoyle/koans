var jwt = require('jwt-simple');
var User = require("../user/user-model");
var userCtrl = require("../user/user-controller");

export class LoginController {

  constructor(private bcrypt) {
  }

  login = (email: string, pwd: string, error: Function, success: Function) => {
    var loginError = "The email and password do not match.";

    User.findOne({ email: email }, (err, user) => {
      if (err) {
        console.log(err);
        error(err);
      } else if (!user) {
        error(loginError);
      } else {
        this.bcrypt.compare(pwd, user.password, function (err, isValid) {

          if (isValid) {
            var payload = {
              sub: user._id
            };
            var token = jwt.encode(payload, userCtrl.getSecret());
            success(token, User.getNonSensitiveUser(user));
          } else {
            error(loginError);
          }
        });
      }
    });
  };

  postLogin = (req, res) => {
    res.format({
      "application/json": (req, res) => {
        var body = req.body;
        this.login(body.email, body.password,
          (err) => {
            console.log(err);
            res.status(401).send({ message: err });
          }, (token, user) => {
            res.status(200).send({ token: token, user: user });
          });

      }
    });
  };
}
