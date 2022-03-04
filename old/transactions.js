const axios = require('axios');
const userRequests = require('./getUserInfo.js')
const dbActions = require('./dbActions.js')

const transactionWin = async (data) => {
    var key = data.transaction_uuid
    var dbData
    //var data = data
    var id
    var currency
    var newBalance = 0
    //console.log(data);
    await dbActions.checkDBForTransaction(data.user, key, data.type).then(
        response => {
            dbData = response;
        }
    );
    if (dbData == undefined) {
        await dbActions.insertIntoDB(data)
        await userRequests.getUserInfofromDB(data.user, data.request_uuid).then(
            response => {
                newBalance = {
                    balance : response.balance + data.amount,
                    request_uuid: data.request_uuid
                }
                id = response.id
                currency = response.currency
                console.log(newBalance);
            }
        )
        await dbActions.changeUserInDB(newBalance,id)
        return {
            user: data.user,
            status: "RS_OK",
            request_uuid: data.request_uuid,
            currency: currency,
            balance: newBalance.balance
        }
    } else {
        console.log(dbData);
        console.log('is there');
        return {
            user: data.user,
            status: "RS_ERROR_DUPLICATE_TRANSACTION",
            request_uuid: data.request_uuid,
        }
    }
    //console.log(isEmpty(dbData));
    //console.log(typeof dbData,"DBDAATATATA");
}


const transactionRollback = async function (data) {
    var refid = data.reference_transaction_uuid
    var amount
    var id
    var currency
    var newBalance = 0
    var dbData
    /*await dbActions.checkDBForTransaction(data.user,refid).then(
        res => {
           dbData = res
        }
    )*/
    dbData = await getDBdata(data.user, refid, data.type)
    if (dbData != undefined) {
        amount = dbData.amount
        console.log('is there');
        await userRequests.getUserInfofromDB(data.user,refid).then(
            res => {
                id = res.id
                newBalance = {
                    balance: res.balance - amount,
                    request_uuid: data.request_uuid
                }
                currency = res.currency
            }
        )
        dbActions.changeUserInDB(newBalance, id)
        dbActions.insertIntoDB(data)
        return {
            user: data.user,
            status: "RS_OK",
            request_uuid: data.request_uuid,
            currency: currency,
            balance: newBalance.balance
        }
    } else {
        console.log('is not there');
        return {
            user: data.user,
            status: "RS_OK",
            request_uuid: data.request_uuid,
        }
    }

}

const transactionBet = async function (data) {
    var dbData
    var id
    dbData = await getDBdata(data.user,data.transaction_uuid,data.type)
    if (dbData == undefined) {
        await userRequests.getUserInfofromDB(data.user,data.transaction_uuid).then(
            res => {
                id = res.id
                newBalance = {
                    balance: res.balance - data.amount,
                    request_uuid: data.request_uuid
                }
                currency = res.currency
            }
        )
        dbActions.changeUserInDB(newBalance, id)
        dbActions.insertIntoDB(data)
        return {
            user: data.user,
            status: "RS_OK",
            request_uuid: data.request_uuid,
            currency: currency,
            balance: newBalance.balance
        }
    } else {
        console.log('is there');
        return {
            user: data.user,
            status: "RS_ERROR_DUPLICATE_TRANSACTION",
            request_uuid: data.request_uuid,
        }
    }
}

async function getDBdata(user, reqid, type) {
    var dbData
    await dbActions.checkDBForTransaction(user,reqid,type).then(
        res => {
           dbData = res
        }
    )
    return dbData
}

exports.transactionWin = transactionWin
exports.transactionRollback = transactionRollback
exports.transactionBet = transactionBet