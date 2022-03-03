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


/*async function checkDBForTransaction(user,key) {
    return axios.get(url+'?user='+user+'&transaction_uuid='+key)
    .then(
        response => {
            console.log(response.data[0],"responseDATATATATAT");
            return response.data[0];
        }
    )
    .catch(error => console.log(error))
}*/



exports.transactionWin = transactionWin