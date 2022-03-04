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
    if (await getDBdata()) {
        
    }
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
    /*if (data.amount < 0) {
        return {
            user: data.user,
            status: "RS_ERROR_WRONG_TYPES",
            request_uuid: data.request_uuid,
        }
    }*/
    dbData = await getDBdata(data.user,data.transaction_uuid,data.type)
    if (dbData == undefined) {
        await userRequests.getUserInfofromDB(data.user,data.transaction_uuid).then(
            res => {
                if (checkForCurrency(data.currency, res.currency) == false) {
                    return {
                        user: data.user,
                        status: "RS_ERROR_WRONG_CURRENCY",
                        request_uuid: data.request_uuid,
                    }
                    
                } if (res.balance < data.amount) {
                    return {
                        user: data.user,
                        status: "RS_ERROR_NOT_ENOUGH_MONEY",
                        request_uuid: data.request_uuid,
                        balance: res.balance,
                        amount: data.amount
                    }
                } else {
                    console.log('All fine');
                    id = res.id
                    newBalance = {
                        balance: res.balance - data.amount,
                        request_uuid: data.request_uuid
                    }
                    currency = res.currency

                }
            }
        )
        dbActions.changeUserInDB(newBalance, id)
        dbActions.insertIntoDB(data)
        console.log(newBalance,"newbalancancn");
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

async function checkForCurrency(currency, userCurrency,) {
    if (currency == userCurrency) {
        console.log('checks passed');
        return true
    } else {return false}
}
exports.transactionWin = transactionWin
exports.transactionRollback = transactionRollback
exports.transactionBet = transactionBet