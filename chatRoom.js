// Ashton King
// CS351

const MessageBar = document.getElementById("messageBar")
const MessageBody = document.getElementById("messageBody")
const LandingBody = document.getElementById("landingBody")
const ChatRoomBody = document.getElementById("chatRoomBody")
const UsernameInput = document.getElementById("usernameInput")
const WelcomeText = document.getElementById("welcomeText")
const RoomButtons = document.getElementById("roomButtons")

// the API URL
const apiUrl = 'http://52.87.246.110/api';

var roomNumber = 3
var failCount = 0
var username
var timer

// Reset Message bar whenever the page is refreshed
MessageBar.value = ""
// MessageBody.innerText = ""


// Functions for buttons on the landing page

function getRandomUsername(){
    return String(
        ADJ[Math.floor(Math.random() * ADJ.length)] +
        "_" +
        ANIMALS[Math.floor(Math.random() * ANIMALS.length)] +
        "_" +
        Math.floor(Math.random() * 999)

    )
}

function goHome(){
    LandingBody.style.display = 'block';
    ChatRoomBody.style.display = 'none';
    if (!username){
        username = getRandomUsername()
    }
    UsernameInput.placeholder = username
    clearInterval(timer)

    getRooms()
    // RoomButtons.innerHTML = `<a class="btn btn-primary btn-lg huge" onclick="goToRoom(1)" role="button"> Room 1 </a>`
    RoomButtons.innerHTML = ""
    for(var j=1; j<=6; j++){
        RoomButtons.innerHTML += `
        <a class="btn btn-primary btn-lg m-2 huge" onclick="goToRoom(${j})" role="button"> 
            Room ${j}
        </a>
        `
    }

}
goHome()

function goToRoom(value){
    LandingBody.style.display = 'none';
    ChatRoomBody.style.display = 'block';
    roomNumber = value
    if (UsernameInput.value){
        username = UsernameInput.value
    }

    WelcomeText.innerText = `Welcome, ${username}, to Room ${roomNumber}!`
    
    getMessages()
    timer = setInterval(getMessages, 1000)
}

function getRooms(){
    get(String(apiUrl + `/current_rooms`)).then(result => {
        console.log(result)
    })
}

// Functions for the messaging side

// This function runs when the send button is pressed
function sendButton(){
    if(MessageBar.value){
        const message = {
            "author": username,
            "room_number": roomNumber,
            "message": MessageBar.value.substring(0,1024),
            "time": String( (new Date()).getTime() )
        }

        // Sending a message to the DB
        sendMessage(String(apiUrl + `/add_message`), message)
    }

    MessageBar.value = ""
}

function getMessages(){
    // Getting all messages from the database
    get(String(apiUrl + `/get_messages/${roomNumber}`)).then(result => {
        MessageBody.innerHTML = ""

        for(i in result.return){
            const timestamp = new Date(parseInt(result.return[i].time))

            MessageBody.innerHTML += `
            <div class="p-3 mb-2 bg-light text-dark rounded">
                <span class="text-primary">${result.return[i].author}</span><span class="text-muted"> ${timestamp.getHours()}:${String(timestamp.getMinutes()).padStart(2, '0')}</span>
                <div>${result.return[i].message}</div>
            </div>
            `
        }
    })
}


// Removing all messages from a room
async function clearAllMessages(){
    try{
        const response = await fetch(
            String(apiUrl + `/clear_messages/${roomNumber}`),
            {
                method: "POST",
            }
        );
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
    }
    catch(error){
        console.log(error)
    }
}

// Make a GET request
async function get(endpoint){
    try{
        const response = await fetch(endpoint, {cache: 'no-cache'});
            if(response.ok){
                failCount = 0;
              const jsonResponse = await response.json()
              return jsonResponse
            }
    }
    catch(error){
        failCount += 1;
        console.log(error)

        if(failCount > 3){
            clearInterval(timer)
        }
    }
}

// Send a message
async function sendMessage(endpoint, data){
    try{
        const response = await fetch(endpoint,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
    }
    catch(error){
        console.log(error)
    }
}