const testView = document.querySelector("#Test")
//this is so we can convert numbers to binary
import {conversion} from "./FiestelCypherStructure.js"
//inisialising variables
let timestamp = 0
let currentSeed = 0

const delay = () =>{
    //generates a random delay
    setTimeout(function(){console.log("delay")}, parseInt(runRegister(GenerateSeed() , 10).toString)+5)

}

//makes key
const GenerateSeed = () =>{
    //takes time and adds it to the milliseconds since the last second
    //this makes an almost unique number
    timestamp = new Date().getUTCMilliseconds()*10000000000 + new Date().valueOf()
    console.log(timestamp)
    // console.log(timestamp)
    let seed = conversion(timestamp)
    let register = []
    //standarises the size of the key
    while (seed.length<104){
        seed = seed + "0"
    }
    // adds to the register
    for (let i = 0;i < seed.length;i++){
        register[i] = seed[i]
    }
    return register
}

//iterates through the register
const runRegister = (seed , size) =>{
    let newRegister = seed
    let length = seed.length
    let randomNumber = []
    //clears seed and generates random number
    for(let i = 0;i<length;i++){
        //this shifts the register and Xors, but doesnt take an output
        //Xor
        newRegister[length-1] = newRegister[0] ^ newRegister[1]
        //shift
        for (let j = 1;j<length;j++){
            newRegister[j-1] = newRegister[j]
        }
        console.log(newRegister)
    }
    //generates "random" number
    for (let i = 0;i<size;i++){
        //this shifts the register and Xors; and takes an output
        //takes output
        randomNumber[i] = newRegister[0]
        //Xor 
        newRegister[length-1] = newRegister[0] ^ newRegister[1]
        //shift
        for (let j = 1;j<length;j++){
            newRegister[j-1] = newRegister[j]
        }
    }
    return randomNumber
}

export const createKey = (size) =>{
    // here we make the 2 random numbers and the mask.
    let Number1 = runRegister(GenerateSeed() , size)
    let Number2 = []
    delay()
    Number2 = runRegister(GenerateSeed() , size)
    delay()
    let permiattionMask = runRegister(GenerateSeed() , size)
    let finalKey = []
    // console.log("keys using :")
    // console.log(Number1 , Number2 , permiattionMask)
    //here we invert a copy of the mask
    let permiattionMaskInv = []
    for (let i = 0;i<permiattionMask.length;i++){
        if (permiattionMask[i] == 0){
            permiattionMaskInv[i] = 1
        }
        else{
            permiattionMaskInv[i] = 0
        }
        //here we use the for loop to AND the two numbers, 
        //with the mask we have and the one we are making
        Number1[i] = Number1[i] && permiattionMask[i]
        Number2[i] = Number2[i] && permiattionMaskInv[i]
        //this appends to the Key
        finalKey[i] = Number1[i] ^ Number2[i]
    }
    // console.log(finalKey)
    return finalKey

}

// let size = 50
// testView.textContent = createKey(size)


console.log("key",createKey(103))


//export {createKey}

