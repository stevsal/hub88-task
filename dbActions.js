const axios = require('axios');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
var dbUrl = process.env.DB_URL
var taurl = 'http://localhost:3001/users_transactions'
var userUrl = 'http://localhost:3001/users'


const insertIntoDB = async function (data) {
    const client = new MongoClient(dbUrl)
    try {
        await client.connect()
        const result = await client.db('testDB').collection('transactions').insertOne(
           data
        )
    } catch {
        console.error(error)
        await client.close()
        return error
    } finally { 
        await client.close()
        console.log('closed')
    }
}

const changeUserInDB = async function (data,id) {
    const client = new MongoClient(dbUrl)
    try {
        await client.connect()
        const result = await client.db('testDB').collection('users').updateOne(
           {id: id}, {$set: data}
        )
    } catch {
        console.error(error)
    } finally { 
        await client.close()
        console.log('closed')
    }
}

const checkDBForTransaction = async function (params) {
    const client = new MongoClient(dbUrl) 
    try {
        await client.connect()
            const result =  await client.db('testDB').collection('transactions').findOne(
                params  
            )
        if (result) {
            console.log(result, 'found transaction for this user with this uuid');
            return result
        } else {
            console.log('did not find transaction')
            return undefined
        }
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
        console.log('closed')
    }
    
}

exports.changeUserInDB = changeUserInDB
exports.insertIntoDB = insertIntoDB
exports.checkDBForTransaction = checkDBForTransaction