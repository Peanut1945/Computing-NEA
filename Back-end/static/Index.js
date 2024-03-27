
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

const decrypt = (info , iterations , keySet) =>{
    //sets cypher type to decryption
    let type = "de"
    //initialises variables
    let originalText = ""
    let start = []
    let end = []
    //splits the inputed array into 2 other arrays
    let midPoint = Math.floor(info.length/2)
    for (let i = 0; i< midPoint; i++){
        start.push(info[i])
    }
    for (let j = midPoint; j < info.length; j++){
        end.push(info[j])
    }
    //we need to re-run the encryption to decrypt so we call the fiestel cypher
    //but we need to switch the start and end
    let Plain = cypher(end , start , iterations , type , keySet)

    //concatinates into one string ready to be converted to letters
    for (let i=0;i<Plain[0].length*2;i++){
        if (i<Plain[0].length){
            originalText += Plain[1][i]
        }else{
            originalText += Plain[0][i-Plain[1].length]
        }
    }
    //makes the ascii code into its plain text so we can read it.
    Plain = BinaryToLetters(originalText)
    return Plain
} 

const BinaryToLetters = (Binary) =>{
    //initiallises variables
    let current = ""
    asciiVal =  ""
    //this takes every 8 digits , adds them to a string , and then turns them into a denary number
    for (let i = 0; i<Binary.length;i++){
        if (current.length == 8){
            asciiVal += (parseInt(current,2)).toString()
            asciiVal += " "
            current = ""
        }
        current += Binary[i]
    }
    asciiVal += (parseInt(current,2)).toString()

    //turns the ascii values in to an array
    asciiVal = asciiVal.split(" ")

    //takes each item in the array and turn it back into a character
    let returnmsg = ""
    for (let i = 0;i < asciiVal.length;i++){
        returnmsg += String.fromCharCode(asciiVal[i])
    }
    return returnmsg

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

Object.objsize = function(obj) { 
    let size = 0, key; 
  
    for (key in obj) { 
        if (obj.hasOwnProperty(key)) 
        size++; 
    } 
    return size; 
}; 



const Form = document.getElementById("Messages")
const RecivedTable = document.getElementById("RecivedMessages")
const enrypIter = 10

Form.addEventListener("submit" , function(e){
    e.preventDefault()

    const formData = new FormData(this)

    fetch("/Messages" , {
        method: "GET",

    }).then(function(response){
        
        return response.json()
    }).then(function(responseJson){
        //here we are going to add all the data to a html table
        //adds the headers to the table 
        //creates the elements in DOM
        headerTable = document.createElement("tr")
        headerOne = document.createElement("th")
        headerTwo = document.createElement("th")
        headerThree = document.createElement("th")
    
        //adds contence to the headers
        headerOne.textContent = "Message ID"
        headerTwo.textContent = "Sender"
        headerThree.textContent = "Message"
        //appends headers to the table row
        headerTable.appendChild(headerOne)
        headerTable.appendChild(headerTwo)
        headerTable.appendChild(headerThree)
        //appends row of headers to the table
        RecivedTable.appendChild(headerTable)
        //fetch the keyset
        let frontKeySet = [getCookie("Key1"),getCookie("Key2"),getCookie("Key3"),getCookie("Key4"),getCookie("Key5"),getCookie("Key6"),getCookie("Key7"),getCookie("Key8"),getCookie("Key9"),getCookie("Key10")]
        for (let i = 0;i<Object.objsize(responseJson); i++){
            //this allows us to reference the numberd parts of the object
            Temp = "message" + i.toString()
            //creates a new table row for this message
            messageRow = document.createElement("tr")
            //creates the column for messageID
            messageID = document.createElement("td")
            //creates column for the Sender of the message
            Sender = document.createElement("td")
            //creates coumn for the Message
            Message = document.createElement("td")
            //adds the data to each column
            console.log(responseJson[Temp])
            messageData = decrypt(responseJson[Temp] , enrypIter , frontKeySet)
            //the above is a string , so i need to remove the left over parts of the array
            //from the server first i remove the brackets at the start and end
            messageData = messageData.slice(1,-1)
            //then we make it into an array , spliting at the commas
            messageDataArray = messageData.split(",")
            console.log("mesageData: " , messageData)
            messageID.textContent = messageDataArray[0]
            //we need to remove the quote marks from the start and end of these 2
            //as there is a space and a quote before each we remove 2 from the start
            Sender.textContent = messageDataArray[2].slice(2,-1)
            Message.textContent = messageDataArray[3].slice(2,-1)
            //adds the columns to the row:
            messageRow.appendChild(messageID)
            messageRow.appendChild(Sender)
            messageRow.appendChild(Message)
            //adds the row to the table , commiting the DOM
            RecivedTable.appendChild(messageRow)
            //adds Extra styles once button clicked
            RecivedTable.className = "Appear"
        }
        return responseJson
    })
})