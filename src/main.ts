import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // var passport = require('passport');
  // var LdapStrategy = require('passport-ldapauth').Strategy;

  // var OPTS = {
  //   server: {
  //     url: '<ldap server>',
  //     bindDn: '<admin username>',
  //     bindCredentials: '<admin password>',
  //     searchBase: '<base dn>',
  //     searchFilter: '(sAMAccountName={{username}})',
  //   },
  // };

  // passport.use(new LdapStrategy(OPTS));

  // app.use(passport.initialize());
  // app.use(passport.session());

  // passport.serializeUser(function (user, done) {
  //   done(null, user);
  // });

  // passport.deserializeUser(function (user, done) {
  //   done(null, user);
  // });


  // var session = require('express-session');
  // app.use(
  //   session({
  //     secret: 'ldap secret',
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: { httpOnly: true, maxAge: 2419200000 }, /// maxAge in milliseconds
  //   }),
  // );

  // app.post('/login', passport.authenticate('ldapauth', {
  //   successRedirect: '/accueil', failureRedirect: '/login'
  // })); 

  await app.listen(3000);
}
bootstrap();
