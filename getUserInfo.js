const axios = require('axios');
var dbUrl = "mongodb+srv://vorumadmin:rrcteam9182@cluster0.jnzp6.mongodb.net/testDB?retryWrites=true&w=majority"
const MongoClient = require('mongodb').MongoClient
var currentUser = ""

const userInfo = async (user, request_uuid) => { 
    currentUser = user;
    console.log('curretnuser', currentUser);
    reqid = request_uuid;
    await getUserInfofromDB(currentUser, reqid).then(
        response => {
            currentUser = response;
        }
    );
    if (currentUser != null) {
        console.log("USERRRRRRRRRRRRr", JSON.stringify(currentUser));
        currentUser.request_uuid = reqid
        currentUser.status = "RS_OK"
        delete currentUser.currency
        delete currentUser.balance
        console.log(currentUser);
        return currentUser;
    } else {
        console.log("User does not exist");
        return {
            user: currentUser,
            status: 'RS_ERROR',
        }
    }
    
}

const userBalance = async (user, request_uuid, gamecode) => {
    var userBalanceObj
    currentUser = user
    reqid = request_uuid
    await getUserInfofromDB(currentUser, reqid).then(
        response => {
            currentUser = response;
        }
    );
    userBalanceObj = {
        user: currentUser.user,
        status: "RS_OK",
        request_uuid: reqid,
        currency: currentUser.currency,
        balance: currentUser.balance
    }
    console.log(userBalanceObj);
    return userBalanceObj
}

  const getUserInfofromDB = async function (user,reqid) {
    const client = new MongoClient(dbUrl)

    try {
        await client.connect()
        const result = await client.db('testDB').collection('users').findOne(
            { user: user }
        )
        if (result) {
            console.log(result);
            return result
        } else {
            console.log('did not find this user')
            return null
        }
    } catch {
        console.error(error)
    } finally { 
        await client.close()
        console.log('closed')
    }
    
}



exports.userInfo = userInfo
exports.userBalance = userBalance
exports.getUserInfofromDB = getUserInfofromDB