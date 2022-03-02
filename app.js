const express = require('express')
const jsonServer = require('json-server')
const app = express()
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = 3000
const userRequests = require('./getUserInfo.js')

server.use(middlewares)
server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running');
})

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/user/info/:header?', async (req,res) => {
  var user = req.body.user//req.params.user;
  var request_uuid = req.body.request_uuid// req.params.requuid
  var body = req.body//req.json({body: req.body})
  res.json(await userRequests.userInfo(user, request_uuid))
})

app.post('/user/balance/:header?', async (req,res) => {
  var user = req.body.user
  var request_uuid = req.body.request_uuid
  var token = req.body.token
  var game_code = req.body.game_code
  res.json(await userRequests.userBalance(user, token, request_uuid, game_code))
})