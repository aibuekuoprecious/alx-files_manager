#!/usr/bin/node

const supertest = require('supertest')
const chai = require('chai')
const router = require('../server')

global.app = router
global.request = supertest(router)
global.expect = chai.expect
global.assert = chai.assert
