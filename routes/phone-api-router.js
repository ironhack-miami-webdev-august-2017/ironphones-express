const express = require('express');

const PhoneModel = require('../models/phone-model');


const router = express.Router();


// GET localhost:3000/api/phones
router.get('/phones', (req, res, next) => {
    PhoneModel.find()
      .limit(20)
      .sort({ _id: -1 })
      .exec((err, recentPhones) => {
          if (err) {
              console.log('Error finding phones', err);
              res.status(500).json({ errorMessage: 'Finding phones went wrong 💩' });
              return;
          }

          res.status(200).json(recentPhones);
      });
}); // GET /phones

// POST localhost:3000/api/phones
router.post('/phones', (req, res, next) => {
    const thePhone = new PhoneModel({
        name: req.body.phoneName,
        brand: req.body.phoneBrand,
        image: req.body.phoneImage,
        specs: req.body.phoneSpecs
    });

    thePhone.save((err) => {
        if (thePhone.errors) {
            res.status(400).json({
                errorMessage: 'Validation failed 🤢',
                validationErrors: thePhone.errors
            });
            return;
        }

        if (err) {
            console.log('Error POSTING phone', err);
            res.status(500).json({ errorMessage: 'New phone went wrong 💩' });
            return;
        }

        res.status(200).json(thePhone);
    });
}); // POST /phones

// GET localhost:3000/api/phones/ID
router.get('/phones/:phoneId', (req, res, next) => {
    PhoneModel.findById(
      req.params.phoneId,
      (err, phoneFromDb) => {
          if (err) {
              console.log('Phone details ERROR', err);
              res.status(500).json({ errorMessage: 'Phone details went wrong 💩' });
              return;
          }

          res.status(200).json(phoneFromDb);
      }
    );
});

// PUT localhost:3000/api/phones/ID
router.put('/phones/:phoneId', (req, res, next) => {
    PhoneModel.findById(
      req.params.phoneId,
      (err, phoneFromDb) => {
          if (err) {
              console.log('Phone details ERROR', err);
              res.status(500).json({ errorMessage: 'Phone details went wrong 💩' });
              return;
          }

          phoneFromDb.set({
              name: req.body.phoneName,
              brand: req.body.phoneBrand,
              image: req.body.phoneImage,
              specs: req.body.phoneSpecs
          });

          phoneFromDb.save((err) => {
              if (phoneFromDb.errors) {
                  res.status(400).json({
                      errorMessage: 'Update validation failed 🤢',
                      validationErrors: phoneFromDb.errors
                  });
                  return;
              }

              if (err) {
                  console.log('Phone update ERROR', err);
                  res.status(500).json({ errorMessage: 'Phone update went wrong 💩' });
                  return;
              }

              res.status(200).json(phoneFromDb);
          }); // phoneFromDb.save()
      }
    ); // PhoneModel.findById()
}); // PUT /phones/:phoneId

// DELETE localhost:3000/api/phones/ID
router.delete('/phones/:phoneId', (req, res, next) => {
    PhoneModel.findByIdAndRemove(
      req.params.phoneId,
      (err, phoneFromDb) => {
          if (err) {
              console.log('Phone delete ERROR', err);
              res.status(500).json({ errorMessage: 'Phone delete went wrong 💩' });
              return;
          }

          res.status(200).json(phoneFromDb);
      }
    );
}); // DELETE /phones/:phoneId


module.exports = router;
