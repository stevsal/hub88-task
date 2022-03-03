const express = require('express')
const jsonServer = require('json-server')
const app = express()
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = 3000
const userRequests = require('./getUserInfo.js')
const transactions = require('./transactions.js')

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
//Could have used objects to send data to functions
app.post('/user/info/:header?', async (req,res) => {
  var user = req.body.user
  var request_uuid = req.body.request_uuid
  var body = req.body
  res.json(await userRequests.userInfo(user, request_uuid))
})

app.post('/user/balance/:header?', async (req,res) => {
  var user = req.body.user
  var request_uuid = req.body.request_uuid
  var token = req.body.token
  var game_code = req.body.game_code
  res.json(await userRequests.userBalance(user, request_uuid, game_code))
})

app.post('/transaction/win/:header?', async (req,res) => {
  var data = req.body
  data.id = ''
  data.type = 'win'
  console.log(data);
  res.json(await transactions.transactionWin(data))
})