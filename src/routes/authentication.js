const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');


const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', [
  // Validar campos
  check('username').notEmpty(),
  check('password').notEmpty()
], (req, res, next) => {
  // Manejar la solicitud y validar los datos
  const errors = validationResult(req);
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});
/*
router.post('/signin', (req, res, next) => {
  req.body.check('username', 'Username is Required').notEmpty();
  req.body.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});*/

router.get('/logout', function(req, res){
  req.logout(function(err) {
      if (err) {
          // Manejar el error
          console.error(err);
          res.redirect('/error'); // Redirigir a una página de error si hay un problema
      } else {
          // Si el usuario se ha deslogueado correctamente
          res.redirect('/'); // Redirigir a la página de inicio o a donde sea apropiado
      }
  });
});


router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;