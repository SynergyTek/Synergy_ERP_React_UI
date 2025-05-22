import axios from "axios";

let dmsApi = axios.create({
    baseURL: 'https://demodms.aitalkx.com/webapi/',
    headers: {
        "Content-Type": "application/json",
    }

})
let chatApi = axios.create({
    baseURL: 'https://bot.aitalkx.com/webhooks/rest/webhook',
    headers: {
        "Content-Type": "application/json",
    }
})
export {dmsApi, chatApi}