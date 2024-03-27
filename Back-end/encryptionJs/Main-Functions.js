import { conversion , split, Xor , BinaryToLetters } from "./FiestelCypherStructure.js";
import { createKey } from "./RandomNumber.js";

let CypherAmount = 10

//this is tempary code for testing
let keySize = 16000
let keyTwo = createKey(keySize)
let keyThree = createKey(keySize)
let keyFour = createKey(keySize)
let keyFive = createKey(keySize)
let keySix = createKey(keySize)
let keySeven = createKey(keySize)
let keyEight = createKey(keySize)
let keyNine = createKey(keySize)
let keyTen = createKey(keySize)
let keyOne = createKey(keySize)


const keyEncryption = (end,key) =>{
    end = Xor(end,key)
    return end
}

const cypher = (start , end , iterations , type) =>{
    //initialises vairables
    let newStart = []
    let newEnd = []
    // start the iterations
    for (let i = 0;i<iterations;i++){
        //this saves the end , so we can make it the start later.
        newStart = end
        //switch case determines which key we need to use
        switch (i){
            case i = 0:
                //checkes if we are encrypting or decyrpting
                if (type == "en"){
                    //chooses the right key
                    end = keyEncryption(end , keyOne)
                }else{
                    end = keyEncryption(end , keyTen)
                }
                break
            case i = 1 :
                if (type == "en"){
                    end = keyEncryption(end , keyTwo)
                }else{
                    end = keyEncryption(end , keyNine)
                }
                break
            case i = 2:
                if (type == "en"){
                    end = keyEncryption(end , keyThree)
                }else{
                    end = keyEncryption(end , keyEight)
                }
                break
            case i = 3:
                if (type == "en"){
                    end = keyEncryption(end , keyFour)
                }else{
                    end = keyEncryption(end , keySeven)
                }
                break
            case i = 4:
                if (type == "en"){
                    end = keyEncryption(end , keyFive)
                }else{
                    end = keyEncryption(end , keySix)
                }
                break
            case i = 5:
                if (type == "en"){
                    end = keyEncryption(end , keySix)
                }else{
                    end = keyEncryption(end , keyFive)
                }
                break
            case i = 6:
                if (type == "en"){
                    end = keyEncryption(end , keySeven)
                }else{
                    end = keyEncryption(end , keyFour)
                }
                break
            case i = 7 :
                if (type == "en"){
                    end = keyEncryption(end , keyEight)
                }else{
                    end = keyEncryption(end , keyThree)
                }
                break
            case i = 8:
                if (type == "en"){
                    end = keyEncryption(end , keyNine)
                }else{
                    end = keyEncryption(end , keyTwo)
                }
                break
            case i = 9:
                if (type == "en"){
                    end = keyEncryption(end , keyTen)
                }else{
                    end = keyEncryption(end , keyOne)
                }
                break
        }
        //switches around the start and end, this takes the 
        //encrypted end and Xors it with the original start
        newEnd = Xor(start , end)
        start = newStart
        end = newEnd
        //then makes the end the Xor result
    }
    return [start , end]
}

const Encrypt = (info,iterations) => {
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
    let message = cypher(start , end , iterations , type)

    //turn start and end into one array
    newMessage = message[0].concat(message[1])
    // newMessage = newMessage.toString()
    return newMessage
}



const decrypt = (info , iterations) =>{
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
    let Plain = cypher(end , start , iterations , type)

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




console.log( "message:" , decrypt(Encrypt("i before e except after c James is fat and needs to get checked for diabeties but tom is also jkinds of weird ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" , CypherAmount) , CypherAmount))


// console.log("cypher text:" , Encrypt("James is fat and needs to get checked for diabeties but tom is also jkinds of wierd ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" , CypherAmount))
