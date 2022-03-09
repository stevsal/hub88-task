const axios = require('axios');
const userRequests = require('./getUserInfo.js')
const dbActions = require('./dbActions.js')

const transactionWin = async (data) => {
    var dbData = await getDBdata(data.user, data.transaction_uuid, data.type)
    var id
    var currency
    var newBalance = 0
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

}


const transactionRollback = async function (data) {
    var refid = data.reference_transaction_uuid
    var amount
    var id
    var currency
    var newBalance = 0
    var dbData
    dbData = await getDBdata(data.user, refid, data.type)
    if (dbData != undefined) {
        amount = dbData.amount
        console.log('is there');
        await userRequests.getUserInfofromDB(data.user,refid).then(
            res => {
                id = res.id
                if (dbData.type == 'win') {
                    newBalance = {
                        balance: res.balance - amount,
                        request_uuid: data.request_uuid
                    }
                } else {
                    newBalance = {
                        balance: res.balance + amount,
                        request_uuid: data.request_uuid
                    }
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
    var newBalance
    if (data.amount < 0) {
        console.log('bad amount');
        return {
            user: data.user,
            status: "RS_ERROR_WRONG_TYPES",
            request_uuid: data.request_uuid,
        }
    }
    dbData = await getDBdata(data.user,data.transaction_uuid,data.type)
    if (dbData == undefined) {
       var userData = await userRequests.getUserInfofromDB(data.user,data.transaction_uuid)
        newBalance = await checkBetData(data,userData)
        if (newBalance.status == "RS_OK") {
            delete newBalance.status
            dbActions.changeUserInDB(newBalance, userData.id)
            dbActions.insertIntoDB(data)
            return {
                user: data.user,
                status: "RS_OK",
                request_uuid: data.request_uuid,
                currency: userData.currency,
                balance: newBalance.balance
            }
        } else {
            return newBalance
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

async function getDBdata(user,reqid,type) {
    var params = {
        user: user,
        transaction_uuid: reqid,
        type: type
    }
    if (type == 'rollback') {
        delete params.type
    }
    var dbData
    await dbActions.checkDBForTransaction(params).then(
        res => {
           dbData = res
        }
    )
    return dbData
}

async function checkBetData(data, userData,) {
    console.log(data.currency, userData.currency);
    if (data.currency != userData.currency) {
        console.log('wrong currency');
        return {
            user: data.user,
            status: "RS_ERROR_WRONG_CURRENCY",
            request_uuid: data.request_uuid,
        }
        
    } if (userData.balance < data.amount) {
        console.log('not enough money');
        return {
            user: data.user,
            status: "RS_ERROR_NOT_ENOUGH_MONEY",
            request_uuid: data.request_uuid,
            balance: userData.balance,
            amount: data.amount
        }
    } else {
        console.log('All fine');
        id = userData.id
        return  {
            status: "RS_OK",
            balance: userData.balance - data.amount,
            request_uuid: data.request_uuid
        }

    }
}
exports.transactionWin = transactionWin
exports.transactionRollback = transactionRollback
exports.transactionBet = transactionBet