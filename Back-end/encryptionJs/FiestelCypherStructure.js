let asciiVal = ""


//function to convery inputed message to binary
const conversion = (info) =>{
    let binaryVal = ""
    let currentLetter = ""
    info = info.toString()
    for (let i = 0; i<info.length; i++){
        //to ascii
        currentLetter = info.charCodeAt(i)
        //append Value to asciivalue
        //this is mainly for testing perposes during development , so i can see what is going on
        asciiVal += currentLetter
        //changes to binary
        currentLetter = currentLetter.toString(2)

        //this makes all the letter 8 bits
        while (currentLetter.length < 8 ){
            currentLetter = "0"+currentLetter
        }
        //Adds letter to the overall value
        binaryVal += currentLetter
        asciiVal += " "
    }
    // console.log(asciiVal)
    // console.log(binaryVal)
    return binaryVal
}

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


export {conversion , split , Xor , BinaryToLetters}


// String += Binary[i].toString()

    // // let current = ""
    // // asciiVal =  ""
    // // for (let i = 0; i<Binary.length;i++){
    // //     if (current.length == 8){
    // //         asciiVal += (parseInt(current,2)).toString()
    // //         asciiVal += " "
    // //         current = ""
    // //     }
    // //     current += Binary[i]
    // // }
    // // asciiVal += (parseInt(current,2)).toString()

    // // console.log(asciiVal)

    // // asciiVal = asciiVal.split(" ")

    // let returnmsg = ""
    // for (let i = 0;i < asciiVal.length;i++){
    //     returnmsg += String.fromCharCode(asciiVal[i])
    // }
    // return returnmsg





    // console.log("final binary" , Binary)
    // let denaryArray = []
    // let tempString = ""
    // let finalString = ""
    // let newInt = []
    // let array = []
    // let count = 0
    // //turns array into a array of ints
    // for (let i = 0;i<Binary.length;i++){
    //    array[i] = Binary[i]
    //    count ++
    //    if (count = 8){
    //         count = 0
    //         for (let j=0;j<8;j++){
    //             tempString += array[j]
    //         }
    //         denaryArray.push(parseInt(tempString , 2))
    //         array = []
    //    }
         
    // }
    // console.log("FInal denary array" , denaryArray)
    // for (let i = 0;i<denaryArray.length;i++){
    //     finalString += String.fromCharCode(denaryArray[i])
    // }
    // return finalString