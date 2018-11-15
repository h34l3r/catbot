const FACEBOOK_ACCESS_TOKEN = 'EAADJpafK5k8BAFgzIGcJx6W7zSyZBZC4DZCrTkmRnJZBozWCm4QcZAORwG9n1sP5YJ29ZALcXVDB6RZAp2JP1HBDbjB3zfL2NYGmnkVcnZCQCAa6iAoDtf9ZCtlBK3In0HT6ZBeVGxqFbYZBJcv0diftZA6ZAQTDjJM0d3mfGF0fwFzq7cac91RQQCChy4zeBbylQvioZD'
const RestClient = require('node-rest-client').Client
const request = require('request')

const sendTextMessage = (senderID, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: { id: senderID},
            message: text
        }
    })
}
const sendGifMessage = (senderID,link) => {//Người nhận và nội dung nhận
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: { id: senderID},
            message:{
                attachment:{
                    type: "image",
                    payload: {
                        //url: "https://vtimes.com.au/up/images/10-15/2019021-tram-tro-voi-nhung-chu-me-0.jpg"
                        url:link
                      }
                }        
            }
        }
    })
}
function titleCase(str) {
    var convertToArray = str.toLowerCase().split(' ');
    var result = convertToArray.map(function(val) {
      return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
    });
    
    return result.join(' ');
  }
var flag="";
module.exports = (event) => {
    const senderID = event.sender.id
    const fbUserMessage = event.message.text
    console.log("Người dùng: "+senderID);
    console.log("Nhắn: "+fbUserMessage); 
    console.log("Cờ: "+flag);
    var senderName = ''
    getSenderInformation((senderInfo) => {
        senderName = senderInfo
    })

    getWitAPIData((witData) => {
        if (witData.entities.intent) {
            switch (witData.entities.intent[0].value) {
                case "chào hỏi":
                    sendTextMessage(senderID, { "text" : "Sa-wa-dee kaa " + senderName + ", Mèo Hannah có thể giúp gì được cho bạn?😁"})
                    sendGifMessage(senderID,"http://img.photobucket.com/albums/v507/ralps/political%20photos%202/political%20photos%202001/Adorable%20Kitten%20standing_zps7odqt6nl.gif");
                    break;
                case "thú cưng":
                    if(witData.entities.cat){
                        switch (witData.entities.cat[0].value) {
                            case "quý tộc":
                                flag=("Mèo "+witData.entities.cat[0].value).toLowerCase();
                                sendTextMessage(senderID, { "text" : "Mèo " + witData.entities.cat[0].value + " của bạn đây!💞 "})
                                sendGifMessage(senderID,"https://vtimes.com.au/up/images/10-15/2019021-tram-tro-voi-nhung-chu-me-0.jpg");
                                break;
                        
                            default:
                                break;
                        }
                    }
                    break;         
                default:
                    break;
            }
            
        }else{
            sendTextMessage(senderID, { "text" : "Hannah vẫn chưa được dạy cái đó 😫"})
        }
    })
    // Ham goi den Wit.ai API 
    function getWitAPIData(callback) {
        var client = new RestClient()
        var arguments = {
            data: { userMessage: fbUserMessage },
            headers: { "Content-Type": "application/json" }
        };
        client.post("http://localhost:4000/v1/getEntitiesInfo", arguments, function(data, response) {
            if (data.isSuccess == true) {
                callback(data.data)
            } else {
                callback(null)
            }
        })
    }

    function getSenderInformation(callback) {
        request({
            url: "https://graph.facebook.com/v2.6/" + event.sender.id,
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN,
                fields: 'last_name'
            },
            method: 'GET'
        }, function(error, response, body) {
            if (!error) {
                var bodyObject = JSON.parse(body)
                callback(bodyObject.last_name)
            }
        })
    }
}