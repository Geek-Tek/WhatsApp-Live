let userPhoneNumber
let messageID = ""
let lastMessageID
let otherUserPhone

// WhatsApp Web class names
// They change A LOT
let textFieldClass = "_13NKt copyable-text selectable-text"
let userIconClass = "_8hzr9 M0JmA i0jNr"
let chatListClass = "_3uIPm WYyr1"
let chatUserIconClass = "_1lPgH"

// creating message class names
let chatMessagesSectionClass = "y8WcF"

// listener is triggered by the bundle.js (the background script)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    switch (message.message) {

        // if the other user has the extension, message = start session
        case "start session":
            console.log("new session started")
            drawStatusCircle("online")
            let chatSection = document.getElementById("main")
            let textField = chatSection.getElementsByClassName(textFieldClass)[0]
            messageID = generateMessageID()
            textField.addEventListener("input", () => {
                /*
                TODO read to which message is responding...

                let respond = chatSection.getElementsByClassName("_2sw49")[0]
                if (respond.style.height != "0px") {
                    console.log("is responding")
                }
                */
                let data = {
                    message: "socket message",
                    txt: textField.innerHTML,
                    messageID: messageID
                }
                chrome.runtime.sendMessage(data)
                
                // if the message has been deleted, regenerate the message ID
                if (textField.innerHTML === "") {
                    messageID = generateMessageID()
                }
            })

            chatSection.addEventListener('keydown', e => {
                if (e.key === "Enter" && textField.innerHTML != "") {
                    chrome.runtime.sendMessage({message: "message sent", messageID: messageID})
                }
            })
            break

        // satus cases
        case "online":
            drawStatusCircle("user online")
            break

        case "user disconnected":
            drawStatusCircle("user offline")
            break

        case "not founded":
            if (otherUserPhone.split("-").length > 1) {
                drawStatusCircle("group")
            } else {
                drawStatusCircle("offline")
            }
            break

        // recived a message from someone else
        case "socket message":
            messageRecived(message)
            break

        // recived the "warning message" for sent message from the other user
        case "message sent":
            let toDelete = document.getElementsByClassName("exterrrnal")[0]
            toDelete.parentNode.removeChild(toDelete)
            break

        // if something goes wrong, just console.log it
        default:
            console.log("unknown message recived")
            break
    }
})

// if the user stop using WhatsApp Web, disconnect the user
window.addEventListener("beforeunload", () => {
    console.log("out of load")
    chrome.runtime.sendMessage({message: "out of load"})
})

// when the user return to WhatsApp Web, reconnect the user to the server
window.addEventListener("load", () => {
    if (userPhoneNumber) {
        console.log("loaded")
        chrome.runtime.sendMessage({message: "loaded"})
    }
})

// NOTE the extension starts execution here
isWhatsAppLoaded()

// check when the user icon is loaded to use it to connect to the server
function isWhatsAppLoaded() {
    let isInWhatsApp = !!document.getElementsByClassName(userIconClass)[0]
    
    if (isInWhatsApp) {
        userPhoneNumber = document.getElementsByClassName(userIconClass)[0].src.split("%")[12].split("&")[2].split("=")[1]
        chrome.runtime.sendMessage({message: "in whatsapp", userPhoneNumber: userPhoneNumber}) 
        
        // start waiting for when the user will enter in a chat
        isEnteringInChat()
    } else {
        // BAD recursive
        window.setTimeout(isWhatsAppLoaded, 500)
        console.log("waiting...")
    }
}

function isEnteringInChat() {

    let chatClicked = document.getElementsByClassName(chatListClass)[0]
    chatClicked.addEventListener("click", e => {
        let chatSection = document.getElementById("main")
        // checking if the user is ever entered in a live chat using messageIDs
        if (messageID != "") {
            chatSection.removeEventListener("keydown", e => {
                if (e.key === "Enter" && textField != "") {
                    chrome.runtime.sendMessage({message: "message sent", messageID: messageID})
                }
            })
        }
        // start waiting if the other user icon is loaded
        isOthersPicutureLoaded()
    })
}

function isOthersPicutureLoaded() {
    let chatSection = document.getElementById("main")
    let picLoaded = !!chatSection.getElementsByClassName(userIconClass)[0]

    if (picLoaded) {
        otherUserPhone = chatSection.getElementsByClassName(userIconClass)[0].src.split("%")[12].split("&")[2].split("=")[1]
        //if (otherUserPhone != userPhoneNumber) {
            chrome.runtime.sendMessage({message: "in a chat", otherUserPhone: otherUserPhone})
        //} else {
            //window.setTimeout(isOthersPicutureLoaded, 50)
        //}
    } else {
        window.setTimeout(isOthersPicutureLoaded, 100)
    }
}

function drawStatusCircle(scope) {
    let canvas = document.createElement('canvas')
    canvas.height = "12"
    canvas.width = "12"
    canvas.style.position = "absolute"
    canvas.style.left = "44px"
    canvas.style.top = "37px"
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d')
        var X = canvas.width / 2
        var Y = canvas.height / 2
        var R = 6
        let circle = new Path2D()
        circle.arc(X, Y, R, 25, 0, 2 * Math.PI)
        switch (scope) {
            case "online":
                ctx.fillStyle = "Lime"
                canvas.title = "This user has WhatsApp Live extension"
                break
            case "user online":
                ctx.fillStyle = "Lime"
                canvas.title = "Connected to WhatsApp Live"
                break
            case "user offline":
                ctx.fillStyle = "#990000"
                canvas.title = "Not connected to WhatsApp Live"
                break
            case "offline":
                ctx.fillStyle = "#484848"
                canvas.title = "This user doesn't use WhatsApp Live extension\nYou should invite him/her"
                break
            default:
                ctx.fillStyle = "#990000"
                canvas.title = "WhatsApp Live doesn't support group chats yet"
                break
        }
        ctx.fill(circle)
    }
    let pic = (scope === "user online" || scope === "user offline") ? document : document.getElementById("main")
    let otherPic = pic.getElementsByClassName(userIconClass)[0]
    otherPic.parentNode.after(canvas)
    let isInChat = !!document.getElementById("main")
    if (isInChat){
        if (document.getElementById("main").getElementsByTagName("canvas").length > 1) {
            document.getElementById("main").getElementsByTagName("canvas")[0].remove()
        }
    }
    if (document.getElementsByClassName(chatUserIconClass)[0].getElementsByTagName("canvas").length > 1) {
        document.getElementsByClassName(chatUserIconClass)[0].getElementsByTagName("canvas")[1].remove()
    }
}

function messageRecived(data) {
    let chatSection = document.getElementById("main")
    let othersMessage = chatSection.getElementsByClassName("_2wUmf message-in focusable-list-item")
    if (othersMessage.length > 0) {
        let ll = othersMessage[othersMessage.length - 1]
        let lll = ll.getElementsByClassName("i0jNr selectable-text copyable-text")[0]
        let lastOther = lll.getElementsByTagName("span")[0]
        if (lastOther.id != data.messageID && data.txt != "") {
            lastMessageID = data.messageID
            createNewMessage(data)
        } else {
            if (data.txt == '') {
                let toDelete = document.getElementsByClassName("exterrrnal")[0]
                toDelete.parentNode.removeChild(toDelete)
            } else {
                lastOther.innerHTML = data.txt
            }
        }
    } else {
        if (data.txt != "") {
            lastMessageID = data.messageID
            createNewMessage(data)
        }
    }
}

function generateMessageID() {
    return '_' + Math.random().toString(36).substr(2, 9)
}

function createNewMessage(data) {
    let external = document.createElement('div')
external.tabIndex = "-1"
external.className = "_2wUmf message-in focusable-list-item exterrrnal"

let uselessSpan = document.createElement('span')
external.appendChild(uselessSpan)

let div1 = document.createElement('div')
div1.className = "Nm1g1 _22AX6"

let usernameSpan = document.createElement('span')
usernameSpan.setAttribute("aria-label", "User:")
div1.appendChild(usernameSpan)

/* let arrowSpan = document.createElement('span')
arrowSpan.classList.add("_1bUzr")
arrowSpan.setAttribute("data-testid", "tail-in")
arrowSpan.setAttribute("data-icon", "tail-in") */ 
let div2 = document.createElement('div')
div2.className = "_22Msk"

let date = new Date()
let h = date.getHours()
if (h < 10) {
    h = "0" + h
}
let mi = date.getMinutes()
if (mi < 10) {
    mi = "0" + mi
}
let g = date.getDay()
let mo = date.getMonth()
let y = date.getFullYear()

let div3 = document.createElement('div')
div3.classList.add("copyable-text")
div3.setAttribute("data-pre-plain-text", `[${h}:${mi}, ${g}/${mo}/${y}] User: `)

let div4 = document.createElement('div')
div4.classList.add("1Gy50")

let spanText = document.createElement('span')
spanText.className = "i0jNr selectable-text copyable-text"
spanText.setAttribute("dir", "ltr")

let actualTextSpan = document.createElement('span')
let texxxt = document.createTextNode(data.txt)
actualTextSpan.appendChild(texxxt)
actualTextSpan.id = data.messageID
spanText.appendChild(actualTextSpan)

div4.appendChild(spanText)

let afterTextSpan = document.createElement('span')
afterTextSpan.classList.add("_20bHr")
div4.appendChild(afterTextSpan)
div3.appendChild(div4)
div2.appendChild(div3)

let div5 = document.createElement('div')
div5.classList.add("_1beEj")

let div6 = document.createElement('div')
div6.className = "_15K2I _3QDB6"

let timeSpan = document.createElement('span')
timeSpan.classList.add("kOrB_")
timeSpan.setAttribute("dir", "auto")

let time = document.createTextNode(h + ":" + mi)
timeSpan.appendChild(time)
div6.appendChild(timeSpan)
div5.appendChild(div6)
div3.appendChild(div5)
div2.appendChild(div3)

let endSpan = document.createElement('span')
div2.appendChild(endSpan)
div1.appendChild(div2)
external.appendChild(div1)

let chatt = document.getElementsByClassName(chatMessagesSectionClass)[0]
chatt.appendChild(external)

    if (data.emoji == true) {
        let txt = external.getElementsByTagName("span")[3]
        txt.innerHTML = data.txt
    }

    external.scrollIntoView()
}
