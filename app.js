const express = require('express')
const jsonServer = require('json-server')
const app = express()
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = 3000
const userRequests = require('./getUserInfo.js')
const transactions = require('./transactions.js')
require('dotenv').config()
var dbUrl = process.env.DB_URL
const MongoClient = require('mongodb').MongoClient


/*server.use(middlewares)
server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running');
})*/

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/user/info/:header?', async (req,res) => {
  res.status(200)
  var user = req.body.user
  var request_uuid = req.body.request_uuid
  var body = req.body
  res.json(await userRequests.userInfo(user, request_uuid))
})

app.post('/user/balance/:header?', async (req,res) => {
  res.status(200)
  var user = req.body.user
  var request_uuid = req.body.request_uuid
  var token = req.body.token
  var game_code = req.body.game_code
  res.json(await userRequests.userBalance(user, request_uuid, game_code))
})

app.post('/transaction/win/:header?', async (req,res) => {
  res.status(200)
  var data = req.body
  data.id = ''
  data.type = 'win'
  res.json(await transactions.transactionWin(data))
})

app.post('/transaction/rollback/:header?', async (req,res) => {
  res.status(200)
  var data = req.body
  data.id = ''
  data.type = 'rollback'
  console.log(data);
  res.json(await transactions.transactionRollback(data))
})

app.post('/transaction/bet/:header?', async (req,res) => {
  res.status(200)
  var data = req.body
  data.id = ''
  data.type = 'bet'
  console.log(data);
  res.json(await transactions.transactionBet(data))
})