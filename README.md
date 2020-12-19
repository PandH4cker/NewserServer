# NewserServer

## Author
[Raphael Dray](https://www.linkedin.com/in/raphaeldray/)

## Introduction

The Newser Server is a RESTful API Node.js Server built for Authentication of Newser Mobile application.


The server integrates a [JWT (JSON Web Token)]() Authentication in order not to store the sessions in the database.

The key for signing the JWT token is base 64 encoded.

BlowFish is used to encrypt password in the database.

It uses MongoDB for saving and creating schemas of the users.

Developed for __the React-Native/Expo mobile App, [Newser](https://github.com/MrrRaph/Newser/)__.

---

## Installation

You will need to start the MongoDB service before launching the server.

```bash
$ git clone https://github.com/MrrRaph/NewserServer.git
$ cd NewserServer
$ npm install
$ npm start
```