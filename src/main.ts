/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bodyParserGraphQL } from 'body-parser-graphql';
// import * as LdapStrategy from 'passport-ldapauth';
// const { ApolloServer } = require('apollo-server');
// const raw = require('raw-body');
// const inflate = require('inflation');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParserGraphQL());
  await app.listen(3000);
}
bootstrap();
