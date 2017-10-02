const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/user-model');


const router = express.Router();


router.post('/process-signup', (req, res, next) => {
    if (!req.body.signupFullName ||
          !req.body.signupUsername ||
          !req.body.signupPassword) {
        res.status(400).json(
          { errorMessage: 'We need full name, username and password.' }
        );
        return;
    }

    UserModel.findOne(
      { username: req.body.signupUsername },
      (err, userFromDb) => {
          if (err) {
              console.log('User find error 🚨', err);
              res.status(500).json({ errorMessage: 'Error finding username.' });
              return;
          }

          if (userFromDb) {
              res.status(400).json({ errorMessage: 'Username was taken.' });
              return;
          }

          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new UserModel({
              fullName: req.body.signupFullName,
              username: req.body.signupUsername,
              encryptedPassword: hashPass
          });

          theUser.save((err) => {
              if (err) {
                  console.log('User save error 🚨', err);
                  res.status(500).json({ errorMessage: 'Error saving user.' });
                  return;
              }

              // clear out the password before sending the user info
              theUser.encryptedPassword = undefined;
              res.status(200).json(theUser);
          });
      }
    ); // UserModel.findOne()
}); // POST /api/process-signup

router.post('/process-login', (req, res, next) => {
    const customAuthCallback =
      passport.authenticate('local', (err, theUser, extraInfo) => {
          if (err) {
              res.status(500).json({ errorMessage: 'Login failed. 💩' });
              return;
          }

          if (!theUser) {
              res.status(401).json({ errorMessage: extraInfo.message });
              return;
          }

          req.login(theUser, (err) => {
              if (err) {
                  res.status(500).json({ errorMessage: 'Login failed. 👽' });
                  return;
              }

              // clear out the password before sending the user info
              theUser.encryptedPassword = undefined;
              res.status(200).json(theUser);
          });
      }); // passport.authenticate('local')

    customAuthCallback(req, res, next);
}); // POST /api/process-login


module.exports = router;