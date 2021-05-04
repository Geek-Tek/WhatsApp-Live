// Report a bug button
let reportBug = document.getElementById("reportBug")
reportBug.addEventListener("click", () => {
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=raffinilorenzo@gmail.com")
})

// Copy sharable link button
let copyLink = document.getElementById("copyLink")
copyLink.addEventListener("click", () => {
    let copy = document.getElementById("li").innerHTML
    navigator.clipboard.writeText(copy)
    let complete = document.getElementById("complete")
    complete.style.display = "initial"
    window.setTimeout(() => {
        complete.style.opacity = 0
    }, 2500)
})

// Tutorial button
let tutorial = document.getElementById("tutorial")
tutorial.addEventListener("click", () => {
    window.open("https://whatsapp-live.glitch.me/tutorial")
})

// Sustain the project button
let sustain = document.getElementById("donation")
sustain.addEventListener("click", () => {
    window.open("https://whatsapp-live.glitch.me")
})