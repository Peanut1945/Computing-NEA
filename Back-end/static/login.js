// import { createKey } from "../encryptionJs/RandomNumber"
// //talk about how could not import 
// import ("/Test")
//     .then((module) =>{
//         console.log(module(100))
//     })
// const createKey = require("../encryptionJs/RandomNumber.js")

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

//

//makes key
// const GenerateSeed = () =>{
//     //takes time and adds it to the milliseconds since the last second
//     //this makes an almost unique number
//     timestamp = new Date().getUTCMilliseconds()*10000000000 + new Date().valueOf()+ new Date().getUTCMilliseconds()
//     let seed = conversion(timestamp)
//     let register = []
//     //standarises the size of the key
//     while (seed.length<104){
//         seed = seed + "0"
//     }
//     // adds to the register
//     for (let i = 0;i < seed.length;i++){
//         register[i] = seed[i]
//     }
//     return register
// }

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

// //iterates through the register
// const runRegister = (seed , size) =>{
//     let newRegister = seed
//     let length = seed.length
//     let randomNumber = []
//     //clears seed and generates random number
//     for(let i = 0;i<length;i++){
//         //this shifts the register and Xors, but doesnt take an output
//         //Xor
//         newRegister[length-1] = newRegister[0] ^ newRegister[1]
//         //shift
//         for (let j = 1;j<length;j++){
//             newRegister[j-1] = newRegister[j]
//         }
//     }
//     //generates "random" number
//     for (let i = 0;i<size;i++){
//         //this shifts the register and Xors; and takes an output
//         //takes output
//         randomNumber[i] = newRegister[0]
//         //Xor 
//         newRegister[length-1] = newRegister[0] ^ newRegister[1]
//         //shift
//         for (let j = 1;j<length;j++){
//             newRegister[j-1] = newRegister[j]
//         }
//     }
//     return randomNumber
// }

// const createKey = (size) =>{
//     // here we make the 2 random numbers and the mask.
//     let Number1 = runRegister(GenerateSeed(size) , size)
//     let Number2 = []
//     delay()
//     for(i = 0;i<20;i++){
//         console.log(i)
//         console.log(i)
//     }
//     Number2 = runRegister(GenerateSeed(size) , size)
//     delay()
//     let permiattionMask = runRegister(GenerateSeed(size) , size)
//     let finalKey = []
//     //here we invert a copy of the mask
//     let permiattionMaskInv = []
//     for (let i = 0;i<permiattionMask.length;i++){
//         if (permiattionMask[i] == 0){
//             permiattionMaskInv[i] = 1
//         }
//         else{
//             permiattionMaskInv[i] = 0
//         }
//         //here we use the for loop to AND the two numbers, 
//         //with the mask we have and the one we are making
//         Number1[i] = Number1[i] && permiattionMask[i]
//         Number2[i] = Number2[i] && permiattionMaskInv[i]
//         //this appends to the Key
//         finalKey[i] = Number1[i] ^ Number2[i]
//     }
    
//     return finalKey

// }

const DiffieHellman = (key , g , N)=>{
    let keyInt = BigInt(parseInt(key, 2))
    keyInt = (g**keyInt)%N
    let keyString = keyInt.toString(2)
    key = keyString.split(",")
    return key
}



// const objToArray = (Object)=>{
//     array = []
//     array[0] = Object.keyOne
//     array[1] = Object.keyTwo
//     array[2] = Object.keyThree
//     array[3] = Object.keyFour
//     array[4] = Object.keyFive
//     array[5] = Object.keySix
//     array[6] = Object.keySeven
//     array[7] = Object.keyEight
//     array[8] = Object.keyNine
//     array[9] = Object.keyTen
//     return array
// }


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
    //initialises variables
    let newStart = [];
    let newEnd = [];
    //checks if we want to encrypt ot decrypt.
    if (typeOf === "en") {
        //being the cypher
        for (let i = 0; i < iterations; i++) {
            //saves the end as we are going to need it later
            newStart = end;
            //here we make sure the key is atleast as long as the mesages
            while (keySet[i].length < end.length) {
                keySet[i] += keySet[i];
            }
            //turns the key into an array from a string 
            const keyAsArray = Array.from(keySet[i]);
            // parses the key as an array into the Xor function.
            end = keyEncryption(end, keyAsArray);
            newEnd = keyEncryption(start, end);
            
            // changes the start to the original end
            start = newStart;
            // makes the end the result of the calculation
            end = newEnd;
        }
        // does the same as above , but changes indexing
        // for the decryption.
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
















const SessionLength = 0.5
const Form = document.getElementById("Login")
const enrypIter = 10

const setKeyCookie = (keySet , expMin)=>{
    let currDate = new Date()
    currDate.setTime(currDate.getTime() + (expMin*1000*60*60))
    let expire = "Expires=" + currDate.toUTCString()
    for (let i = 1;i <keySet.length +1;i++){
        document.cookie = "Key" + i + "=" + keySet[i-1] + ";" +expire + ";path=/"
    } 
}

const setUserCookie = (User,expMin) =>{
    let currDate = new Date()
    currDate.setTime(currDate.getTime() + (expMin*1000*60*60))
    let expire = "Expires=" + currDate.toUTCString()
    document.cookie = "User=" + User + ";" + expire + ";path=/"
}

//document.cookie.match(/^(.*;)?\s*MyCookie\s*=\s*[^;]+(.*)?$/)

Form.addEventListener("submit" , function(e){
    //prevents form from being submitted from HTML
    e.preventDefault()
    //initialises variables
    let g = 3n
    let N = 31n
    let keyLength = 5

    // creates the set of keys as an array
    let keySetClient = [createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),createKey(keyLength),]

    // does the first half of the key exchange
    for(let i = 0;i<keySetClient.length;i++){
        //this is out first round of diffie Hellman 
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

    //gets the data from the form so we can use it later
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
        // returns response as a javscript object
        return response.json()
    }).then(function(JsonResponse){
        //splits JsonResponse up into smaller parts
        let FinalKeySet = []

        for (let i = 0; i < keySetClient.length; i++) {
            // this turns the keyset into an array
            FinalKeySet[i] = DiffieHellman(JsonResponse[i],BigInt(parseInt(keySetClient[i].join(''), 2)), N);
            //makes sure the zeros are appended to front as they get lost in the calculations
            while(FinalKeySet[i][0].length<5){
                FinalKeySet[i][0] = "0"+FinalKeySet[i][0]
            }
        }
        //sets keys as cookies so they can be stored for your session.
        setKeyCookie(FinalKeySet , SessionLength)
        //encrypt before the next operation in chain
        //create an object pertaining to the parts of the data being sent
        let dataObject = {
            User:Encrypt(formData.get("User") ,enrypIter , FinalKeySet ),
            Password:Encrypt(formData.get("Password") , enrypIter , FinalKeySet)
        }
    
        return dataObject
    }).then(function(dataObject){
        //then sends form data to log in
        fetch("/login" , {
            method: "POST",
            body: JSON.stringify(dataObject),
            headers: {
            'content-type': 'application/json'
        }

        }).then(function (response) {
            //takes the response and sends to next promise as text
            return response.text()

        }).then(function(responseStr){
            // if the returned value is False we alert the user
            if (responseStr == "False"){
                alert("your user name or password ws incorrect")
                //then we re-load the window
                window.location.reload()
            }
            else{
                //if the login did not fail , we add the username 
                //to the bowser as a cookie so signify whos session it is.
                setUserCookie(responseStr , SessionLength)
                // then we take them to the home page
                window.location.href = "/"
            }
        })

    })
})




// for(let j=0;j<keySetClient[i].length;j++){
//     key += keySetClient[i][j].toString()
// }

// console.log(key)
// key = BigInt(key)
// key = BigInt(parseInt(key, 2))
// console.log(key)
// key = g.modPow(key,N)
// let keyString = key.toString(2)
// keySetClient[i] = keyString.split("")
// console.log("after")
// console.log(keySetClient[i])





// const SplitArrays = (keySetClient) => {
//     let keySegmentLength = 5
//     let key = []
//     //large prime number
//     for(let i = 0;i<keySetClient.length;i++){
//         //turns key into 10 smaller keys
//         //initialise variables
//         let ArrayToPush = []
//         let keyArray = []
//         let count = 0
//         let keyPosition = 0
//         //appends key to smaller keys
//         for (let j = 0; j<keySetClient[i].length;j++){
//             //every 10 bits , start a new array
//             if (count >= keySegmentLength ){
//                 keyArray.push(ArrayToPush)
//                 count = 0
//                 keyPosition+=1
//                 ArrayToPush = []
//             }
//             //adds each bit to array
//             ArrayToPush.push( keySetClient[i][j])
//             count+=1
//             //this just adds the very last bit to be added
//             if(j == keySetClient[i].length-1){
//                 keyArray.push(ArrayToPush)
//             }
//         }  
//         key.push(keyArray)
//     }
//     return key
// }