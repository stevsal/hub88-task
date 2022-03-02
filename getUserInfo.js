const axios = require('axios');

var currentUser = ""

const userInfo = async (user, request_uuid) => { 
    currentUser = user;
    reqid = request_uuid;
    await getUserInfofromDB(currentUser, reqid).then(
        response => {
            currentUser = response;
        }
    );
    
    console.log("USERRRRRRRRRRRRr", JSON.stringify(currentUser));
    currentUser.request_uuid = reqid
    currentUser.status = "RS_OK"
    delete currentUser.currency
    delete currentUser.balance
    console.log(currentUser);
    return currentUser;
}

const userBalance = async (user, token, request_uuid, gamecode) => {
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

async function getUserInfofromDB(user,reqid) {
    var name = user
    return axios.get('http://localhost:3001/users?user='+name)
    .then(
        response => {
            //console.log(response.data[0],"responseDATATATATAT");
            return response.data[0];
        }
    )
    .catch(error => console.log(error))
    
}



exports.userInfo = userInfo
exports.userBalance = userBalance