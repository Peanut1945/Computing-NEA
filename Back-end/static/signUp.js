
//function to convery inputed message to binary
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

//inisialising variables
let timestamp = 0
let currentSeed = 0

const delay = () =>{
    //generates a random delay
    setTimeout(function(){console.log("delay")}, parseInt(runRegister(GenerateSeed() , 2).toString))

}


function createKey(length) {
    if (typeof length !== 'number' || length <= 0) {
      throw new Error('Length must be a positive number');
    }
  
    let binaryNumber = '';
  
    for (let i = 0; i < length; i++) {
      const randomBit = Math.round(Math.random());
      binaryNumber += randomBit;
    }
  
    return binaryNumber;
}


const DiffieHellman = (key , g , N)=>{
    let keyInt = BigInt(parseInt(key, 2))
    keyInt = (g**keyInt)%N
    let keyString = keyInt.toString(2)
    key = keyString.split(",")
    return key
}



//encryption:

//splits the data into to sections to be decoded
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

const keyEncryption = (end,key) =>{
    end = Xor(end,key)
    return end
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



const decrypt = (info , iterations , keySet) =>{
    console.log("start dycription")
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


const Form = document.getElementById("sign-up")
const enrypIter = 10

Form.addEventListener("submit" , function(e){
    
    //prevents form from being submitted from HTML
    let g = 3n
    let N = 31n
    e.preventDefault()
    let keyLength = 5

    let keySetClient = [createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),]

    // does the first half of the key exchange
    for(let i = 0;i<keySetClient.length;i++){
        keySetClient[i] = DiffieHellman(keySetClient[i],g,N)
    }

    //creates the keyset as an object , to be sent using JSON 
    let FrontKeySet = {
        Length:keyLength,
        keyOne:keySetClient[0],
        keyTwo:keySetClient[1],
        keyThree:keySetClient[2],
        keyFour:keySetClient[3],
        keyFive:keySetClient[4],
        keySix:keySetClient[5],
        keySeven:keySetClient[6],
        keyEight:keySetClient[7],
        keyNine:keySetClient[8],
        keyTen:keySetClient[9]
    }
    console.log(FrontKeySet)
    console.log("listend")

    
    const formData = new FormData(this)
    //key exchange
    fetch("/ExNone",{
        //sends the keys over as a Json file
        method: "POST",
        body: JSON.stringify(FrontKeySet),
        headers: {
            'content-type': 'application/json'
        }
    }).then(function(response){
        return response.json()
    }).then(function(JsonResponse){
        //splits JsonResponse up into smaller parts
        let FinalKeySet = []

        for (let i = 0; i < keySetClient.length; i++) {
            FinalKeySet[i] = DiffieHellman(JsonResponse[i],BigInt(parseInt(keySetClient[i].join(''), 2)), N);
            while(FinalKeySet[i][0].length<5){
                FinalKeySet[i][0] = "0"+FinalKeySet[i][0]
                console.log("unshifted")
            }
        }
        //encrypt before the next operation in chain
        //create an object pertaining to the parts of the data being sent
        let dataObject = {
            User:Encrypt(formData.get("User") ,enrypIter , FinalKeySet ),
            Password:Encrypt(formData.get("Password") , enrypIter , FinalKeySet)
        }
        console.log("dataObject" , dataObject)
        return dataObject
    }).then(function(dataObject){
        fetch("/sign-up" , {
            method: "POST",
            body: JSON.stringify(dataObject),
            headers: {
            'content-type': 'application/json'
            }

        }).then(function (response) {
            //returns the response as a string so we can use it 
            return response.text()

        }).then(function (responseStr){
            //checks if we have make and account
            if (responseStr == "True"){
                window.location.href = "/login"
                alert("you have successfully made an account , please log in")
            }
            else{
                alert("sorry that username is already taken")
            }
            return(responseStr)
        })
        .catch(function (error){
            console.error(error)
            console.log("an error")
        })
    })


})













// if (response.content == "Money"){
//     window.location.href = "/login"
// }