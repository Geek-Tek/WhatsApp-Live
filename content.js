let userPhoneNumber
let messageID = ""
let lastMessageID
let otherUserPhone

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    switch (message.message) {

        case "start session":
            console.log("new session started")
            drawStatusCircle("online")
            let chatSection = document.getElementById("main")
            let textField = chatSection.getElementsByClassName("_2_1wd copyable-text selectable-text")[0]
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

        case "not founded":
            if (otherUserPhone.split("-").length > 1) {
                drawStatusCircle("group")
            } else {
                drawStatusCircle("offline")
            }
            break

        case "socket message":
            messageRecived(message)
            break

        case "message sent":
            let toDelete = document.getElementsByClassName("exterrrnal")[0]
            toDelete.parentNode.removeChild(toDelete)
            break

        case "updated!":
            console.log("You need to reload the page")
            break

        default:
            console.log("unknown message recived")
            break
    }
})

window.addEventListener("beforeunload", () => {
    console.log("out of load")
    chrome.runtime.sendMessage({message: "out of load"})
})

window.addEventListener("load", () => {
    if (userPhoneNumber) {
        console.log("loaded")
        chrome.runtime.sendMessage({message: "loaded"})
    }
})

isWhatsAppLoaded()

function isWhatsAppLoaded() {
    let isInWhatsApp = !!document.getElementsByClassName("_18-9u _1bvi5 _3-8er")[0]
    
    if (isInWhatsApp) {
        userPhoneNumber = document.getElementsByClassName("_18-9u _1bvi5 _3-8er")[0].src.split("%")[12].split("&")[2].split("=")[1]
        chrome.runtime.sendMessage({message: "in whatsapp", userPhoneNumber: userPhoneNumber}) 
        
        isEnteringInChat()
    } else {
        window.setTimeout(isWhatsAppLoaded, 500)
        console.log("waiting...")
    }
}

function isEnteringInChat() {
    let chatClicked = document.getElementsByClassName("JnmQF _3QmOg")[0]
    chatClicked.addEventListener("click", e => {
        let chatSection = document.getElementById("main")
        if (messageID != "") {
            chatSection.removeEventListener("keydown", e => {
                if (e.key === "Enter" && textField != "") {
                    chrome.runtime.sendMessage({message: "message sent", messageID: messageID})
                }
            })
        }
        isOthersPicutureLoaded()
    })
}

function isOthersPicutureLoaded() {
    let chatSection = document.getElementById("main")
    let picLoaded = !!chatSection.getElementsByClassName("_18-9u _1bvi5 _3-8er")[0]
    if (picLoaded) {
        otherUserPhone = chatSection.getElementsByClassName("_18-9u _1bvi5 _3-8er")[0].src.split("%")[12].split("&")[2].split("=")[1]
        if (otherUserPhone != userPhoneNumber) {
            chrome.runtime.sendMessage({message: "in a chat", otherUserPhone: otherUserPhone})
        } else {
            window.setTimeout(isOthersPicutureLoaded, 50)
        }
    } else {
        window.setTimeout(isOthersPicutureLoaded, 100)
    }
}

function drawStatusCircle(scope) {
    let otherPic = document.getElementById("main").getElementsByClassName('_18-9u _1bvi5 _3-8er')[0];
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
    otherPic.parentNode.after(canvas)
    if (document.getElementsByTagName("canvas").length > 1) {
        document.getElementsByTagName("canvas")[0].remove()
    }
}

function messageRecived(data) {
    let chatSection = document.getElementById("main")
    let othersMessage = chatSection.getElementsByClassName("GDTQm message-in focusable-list-item")
    if (othersMessage.length > 0) {
        let ll = othersMessage[othersMessage.length - 1]
        let lll = ll.getElementsByClassName("_3-8er selectable-text copyable-text")[0]
        let lastOther = lll.getElementsByTagName("span")[0]
        if (lastOther.id != data.messageID && data.txt != "") {
            console.log(data.txt)
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
    external.className = "GDTQm message-in focusable-list-item exterrrnal"

    let uselessSpan = document.createElement('span')
    external.appendChild(uselessSpan)

    let div1 = document.createElement('div')
    div1.className = "_24wtQ _2W7I-"
    // div1.classList.add("_1-U5A")

    let arrowSpan = document.createElement('span')
    arrowSpan.classList.add("_1bUzr")
    arrowSpan.setAttribute("data-testid", "tail-in")
    arrowSpan.setAttribute("data-icon", "tail-in")
    
    // TODO message up-left arrow
    /*
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("viewBox", "0 0 8 13")
    svg.setAttribute("width", "8")
    svg.setAttribute("height", "13")

    let path1 = document.createElementNS('http://www.w3.org/2000/svg',"path")


        <span data-testid="tail-in" data-icon="tail-in" class="_1bUzr"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 8 13"
        width="8"
        height="13"
      >
        <path
          opacity=".13"
          fill="#0000000"
          d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"
        ></path>
        <path
          fill="currentColor"
          d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"
        ></path></svg
    ></span>
    */
    
    let div2 = document.createElement('div')
    div2.className = "_3XpKm _20zqk"
    let usernameSpan = document.createElement('span')
    usernameSpan.setAttribute("aria-label", "User:")
    div2.appendChild(usernameSpan)

    let div3 = document.createElement('div')
    div3.classList.add("_1bR5a")

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

    let div4 = document.createElement('div')
    div4.classList.add("copyable-text")
    div4.setAttribute("data-pre-plain-text", `[${h}:${mi}, ${g}/${mo}/${y}] User: `)
    
    let div5 = document.createElement('div')
    div5.classList.add("_3ExzF")
    
    let spanText = document.createElement('span')
    spanText.className = "_3-8er selectable-text copyable-text"
    spanText.setAttribute("dir", "ltr")
    
    let actualTextSpan = document.createElement('span')
    let texxxt = document.createTextNode(data.txt)
    actualTextSpan.appendChild(texxxt)
    actualTextSpan.id = data.messageID
    spanText.appendChild(actualTextSpan)
    div5.appendChild(spanText)
    
    let afterTextSpan = document.createElement('span')
    afterTextSpan.classList.add("_1Bd9o")
    div5.appendChild(afterTextSpan)
    div4.appendChild(div5)
    div3.appendChild(div4)
    
    let div6 = document.createElement('div')
    div6.classList.add("_2zWo9")
    
    let div7 = document.createElement('div')
    div7.className = "UFTvj _89eWV"
    
    let timeSpan = document.createElement('span')
    timeSpan.classList.add("_17Osw")
    timeSpan.setAttribute("dir", "auto")
    
    let time = document.createTextNode(h + ":" + mi)
    timeSpan.appendChild(time)
    div7.appendChild(timeSpan)
    div6.appendChild(div7)
    div3.appendChild(div6)
    div2.appendChild(div3)

    let endSpan = document.createElement('span')
    div2.appendChild(endSpan)
    div1.appendChild(div2)
    external.appendChild(div1)

    let chatt = document.getElementsByClassName("_11liR")[0]
    chatt.appendChild(external)

    if (data.emoji == true) {
        let txt = external.getElementsByTagName("span")[3]
        txt.innerHTML = data.txt
    }

    external.scrollIntoView()
}
