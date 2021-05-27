# WhatsApp Live Chrome extension
This is a WhatsApp Web Chrome extension that allows users to read messages while they're written.  
You won't need to wait until the other person finshes to write the message and send it.  
Live chats are a lot more interesting and engaging, it's a new way of communication.

## Worth note:
This is the actual extension code, if you want to see or change the server-side code, you can go [here](https://github.com/Geek-Tek/WhatsApp-Live-Server).  
The actual Chrome extension can be founded on the [Chrome WebStore](https://chrome.google.com/webstore/detail/whatsapp-live/ohcpfmdkhhcfhcigeigigpmlngohloea).

## About the project
- `WhatsAppLiveLogo_128.png` is the only icon of the project, it's used everytime the extension needs to be displayed
- `bundle.js` is the background script, from where the extension connects to the server. It also contains all the socket.io-client code
- `content.js` is the usual content scripts that interacts with the WhatsApp Web page
- `manifest.json` uses manifest v.2, so yet no service workers and so on (I'll probably will update it soon)
- `popup.html` and `popup.js` are loaded when you click the extension's icon

## Legal note:
WhatsApp is a trademark of WhatsApp Inc.
WhatsApp Live, developed by Lorenzo Raffini, has no connection with WhatsApp or WhatsApp Inc.

## Additional info:
This extension was made in only a month by a 17 years old solo programmer without any previous knowledge of NodeJS, Express, Socket.io, GitHub or even Chrome extensions programming.
So please be kind and collaborative, help me improving this really fun project, thanks ; )
