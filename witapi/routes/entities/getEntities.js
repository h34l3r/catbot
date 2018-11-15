const Wit = require('node-wit').Wit
const witClient = new Wit({
    accessToken : 'GQ7ZDXI42YFR3Z24RXTLGMKRFSUZLBW5'
    }
)

module.exports = (request, response) => {
    var message = request.body.userMessage
    witClient.message(message, {}).then((returnData) => {
        var returnMessage = {
            isSuccess : true,
            message: 'Call Wit.ai successful',
            data: returnData
        }
        response.json(returnMessage)
    }).catch((err) => {
        var returnMessage = {
            isSuccess: false,
            message: err
        }
        response.json(returnMessage)
    })
}