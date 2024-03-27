//make function that retireves cookies

const Encrypt = (info,iterations , keySet) => {
    //sets the tyoe of cypher to encryption
    let type = "en"
    //initialises variabels
    let newMessage = []
    let plainText = []
    //changes message into binary
    info = conversion(info)
    //gets the plain text we want , and splits into two parts
    plainText = split(info)
    let start = plainText[0]
    let end = plainText[1]

    //runs the fiestel cypher , and parses the amount of times its going to run.
    let message = cypher(start , end , iterations , type , keySet)

    //turn start and end into one array
    newMessage = message[0].concat(message[1])
    // newMessage = newMessage.toString()
    return newMessage
}

const cypher = (start, end, iterations, typeOf, keySet) => {
    let newStart = [];
    let newEnd = [];
    console.log(keySet)
    if (typeOf === "en") {
        for (let i = 0; i < iterations; i++) {
            newStart = end;
            
            while (keySet[i].length < end.length) {
                keySet[i] += keySet[i];
            }
            
            const keyAsArray = Array.from(keySet[i]);
            end = keyEncryption(end, keyAsArray);
            newEnd = keyEncryption(start, end);
            
            start = newStart;
            end = newEnd;
        }
    } else {
        for (let i = iterations; i > 0; i--) {
            newStart = end;
            
            while (keySet[i - 1].length < end.length) {
                keySet[i - 1] += keySet[i - 1];
            }
            
            const keyAsArray = Array.from(keySet[i - 1]);
            end = keyEncryption(end, keyAsArray);
            newEnd = keyEncryption(start, end);
            
            start = newStart;
            end = newEnd;
        }
    }
    
    return [start, end];
}

const split = (binaryVal) =>{
    //defines start and end as arrays
    let start = []
    let end = []
    //finds the hlafway point
    let midPoint = Math.floor(binaryVal.length/2)
    let array = binaryVal.split("")
    //thisappends the start and end as arrays 
    for (let i = 0; i< midPoint; i++){
        start.push(array[i])
    }
    for (let j = midPoint; j < binaryVal.length; j++){
        end.push(array[j])
    }
    // console.log("start: " + start)
    // console.log("end: " + end)
    return [start , end]
}

const conversion = (info) =>{
    let binaryVal = ""
    let currentLetter = ""
    info = info.toString()
    for (let i = 0; i<info.length; i++){
        //to ascii
        currentLetter = info.charCodeAt(i)
        //changes to binary
        currentLetter = currentLetter.toString(2)

        //this makes all the letter 8 bits
        while (currentLetter.length < 8 ){
            currentLetter = "0"+currentLetter
        }
        //Adds letter to the overall value
        binaryVal += currentLetter
    }

    return binaryVal
}

const keyEncryption = (end,key) =>{
    end = Xor(end,key)
    return end
}

//will handel all Xor operations
const Xor = (start,end) =>{
    //initialises result locally
    let result = []
    //sets each iteam to the Xor result
    //does it for the length of start , so when we use a key, it will only do it to the required length
    for (let i = 0; i<start.length;i++){

        result[i] = start[i] ^ end[i]
    }
    return result
}


const getCookie = (cookieName) =>{
    //sets cookieValue tothe value of the required cookie.
    let cookieValue = document.cookie
    //splits the cookeis up
    .split("; ")
    .find((row) => row.startsWith(cookieName + "="))
    ?.split("=")[1];
    //sends back the cookie data
    return cookieValue
}





const Form = document.getElementById("send")
const enrypIter = 10

Form.addEventListener("submit" , function(e){
    //prevents request from sending
    e.preventDefault()
    //gets the data from the form
    const formData = new FormData(this)

    //make object that will hold cookies
    let frontKeySet = [getCookie("Key1"),getCookie("Key2"),getCookie("Key3"),getCookie("Key4"),getCookie("Key5"),getCookie("Key6"),getCookie("Key7"),getCookie("Key8"),getCookie("Key9"),getCookie("Key10")]
  
    //encrypt data using cookies and store as an object to be sent
    let dataObject = {
        Recipient:Encrypt(formData.get("Recipient") ,enrypIter , frontKeySet ),
        Message:Encrypt(formData.get("Message") , enrypIter , frontKeySet)
    }

    fetch("/send" , {
        //sends a post request with the message data
        method: "POST",
        body: JSON.stringify(dataObject),
        headers: {
            'content-type': 'application/json'
        }

    }).then(function (response) {
        console.log(response)
        // returns the response as text to the next promise
        return response.text()

    }).then(function(responsestr){
        //this just checks that the message has made its way to the server
        if (responsestr == "sent"){
            window.location.reload
            alert("the message has been recived by the server")

        }else{
            alert("sorry something went wrong, did you input the correct username?")
        }
        // if not we catch the error and log it to the console.
    }).catch(function (error){
        console.error(error)
        console.log("an error")
    })
})