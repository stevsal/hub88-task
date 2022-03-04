const axios = require('axios');
var taurl = 'http://localhost:3001/users_transactions'
var userUrl = 'http://localhost:3001/users'


const insertIntoDB = async function (data) {
    axios.post(taurl, data).then(
        res => {
            console.log(res.data)
        }
    ).catch(
        error => console.log(error)
    )
}

const changeUserInDB = async function (data,id) {
    axios.patch(userUrl+"/"+id, data).then(
        res => {
            console.log(res.data)
        }
    ).catch(
        error => console.log(error)
    )
}

const checkDBForTransaction = async function (user,key,type) {
    if (type == 'rollback') {
        return axios.get(taurl+'?user='+user+'&transaction_uuid='+key)
    .then(
        response => {
            //console.log(response.data[0],"responseDATATATATAT");
            return response.data[0];
        }
    )
    .catch(error => console.log(error))
    } else {
        return axios.get(taurl+'?user='+user+'&transaction_uuid='+key+'&type='+type)
    .then(
        response => {
            //console.log(response.data[0],"responseDATATATATAT");
            return response.data[0];
        }
    )
    .catch(error => console.log(error))
    }
    
}

exports.changeUserInDB = changeUserInDB
exports.insertIntoDB = insertIntoDB
exports.checkDBForTransaction = checkDBForTransaction