const { webHookUrl } = require('../../config/env.js')
const axios = require('axios')

const transactionWebHook = async (transactionData) => {

    try {
        await axios.post(webHookUrl, {
            receiver: transactionData.receiver,
            sender: transactionData.sender,
            id: transactionData.id,
            status: transactionData.status,
        }).then(response => response).catch(error => console.error("webHook error:", error))
    } catch (error) {
        console.log("Axios error: ", error.message)
    }


}

module.exports = { transactionWebHook }