// Ashton King
// CS351

const MessageBar = document.getElementById("messageBar")

// Reset Message bar whenever the page is refreshed
MessageBar.value = ""

// This function runs when the send button is pressed
function sendButton(){
    const message = {
        "from": "admin",
        "room": "room1",
        "body": MessageBar.value,
    }
    console.log(message)

    MessageBar.value = ""
}