// Ashton King
// CS351

const MessageBar = document.getElementById("messageBar")

// Reset Message bar
MessageBar.value = ""

// Placeholder function that just dumps to console
function sendButton(){
    console.log(MessageBar.value)
    MessageBar.value = ""
}