#!/usr/bin/node

const express = require('express')
const AppController = require('../controllers/AppController')
const UsersController = require('../controllers/UsersController')
const AuthController = require('../controllers/AuthController')
const FilesController = require('../controllers/FilesController')
const { basicAuthenticate, xTokenAuthenticate } = require('../middlewares/auth')
const { APIError, errorResponse } = require('../middlewares/error')

const router = express.Router()

router.get('/status', AppController.getStatus)
router.get('/stats', AppController.getStats)
router.post('/users', UsersController.postNew)
router.get('/connect', AuthController.getConnect)
router.get('/disconnect', AuthController.getDisconnect)
router.get('/users/me', AuthController.getMe)

router.post('/files', xTokenAuthenticate, FilesController.postUpload)
router.get('/files/:id', xTokenAuthenticate, FilesController.getShow)
router.get('/files', xTokenAuthenticate, FilesController.getIndex)
router.put('/files/:id/publish', xTokenAuthenticate, FilesController.putPublish)
router.put('/files/:id/unpublish', xTokenAuthenticate, FilesController.putUnpublish)
router.get('/files/:id/data', FilesController.getFile)

router.get('/connect', basicAuthenticate, AuthController.getConnect)
router.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect)

router.all('*', (req, res, next) => {
  errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next)
})
router.use(errorResponse)

module.exports = router
