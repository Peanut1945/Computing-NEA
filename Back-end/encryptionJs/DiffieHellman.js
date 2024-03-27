//large prime
N = 928221641260604345736038009852110192192263109688299955954426520280899018125425480827492970829991034616421084561514990072768488071245056591320343027740891041125178436926290182631877646882416501620243441627935534158326642428976171839252185433488772813941153937605874170650189507957213726863962673881084422477247n
//small prime
g = 3

//765169806916241n



fetch("/ExNone",{
    method: "POST",
    body: JSON.stringify(FrontKeySet),
    headers: {
        'content-type': 'application/json'
    }
}).then(function(response){
    return response.json()
}).then(function(JsonResponse){
    //splits JsonResponse up into smaller parts
    JsonResponse = SplitArrays(JsonResponse)
    let key = ""
    console.log(JsonResponse , "Jsonresponse")
    for(let i = 0;i<JsonResponse.length;i++){
        for(let j=0;j<JsonResponse[i].length;j++){

            key += DiffieHelmanTwo(keySetClient[i], JsonResponse[i][j],N).join("")

        }
        keySetClient[i] = key
        key = ""
    }
    console.log(keySetClient)
})



    const keyMaths = (key , g , N)=>{
        // joins the key array into a string
        let keyString = key.join("")   
        // turns string into in with greater accuracy 
        let keyInt = BigInt(parseInt(keyString, 2))
        // does the modulous/the diffie hellman maths
        keyInt = (g**keyInt)%N
        //turns it back into binary
        keyString = keyInt.toString(2)
        // makes it back into an array
        key = keyString.split(",")
        return key
    }


const DiffieHelmanTwo = (keySetClient, g , N)=>{
        console.log("diffieHellmn two")
        let gString = ""
        //turns g into a string
        for(let j=0;j<g.length;j++){
            gString += g.join("")  
        }
        //turns g into a BigInt
        g = BigInt(parseInt(gString, 2))
        //turns key into 10 smaller keys
        //initialise variables
        let keySegmentLength = 5
        let key = []
        let ArrayToPush = []
        let keyArray = []
        let count = 0
        let keyPosition = 0
        //appends key to smaller keys
        for (let j = 0; j<keySetClient.length;j++){
            //every 10 bits , start a new array
            if (count >= keySegmentLength ){
                keyArray.push(ArrayToPush)
                count = 0
                keyPosition+=1
                ArrayToPush = []
            }
            //adds each bit to array
            ArrayToPush.push( keySetClient[j])
            count+=1
            //this just adds the very last bit to be added
            if(j == keySetClient.length-1){
                keyArray.push(ArrayToPush)
            }
        }
        // does the maths
        for(let j = 0;j<keyArray.length;j++){
            keyArray[j] = keyMaths(keyArray[j] , g , N)
        }
    
        return keyArray
    }



//need to split key into bytes and do it one byte at a time
const DiffieHelman = (keySetClient , g , N)=>{
    let keySegmentLength = 5
    let key = []
    //large prime number
    for(let i = 0;i<keySetClient.length;i++){
        //turns key into 10 smaller keys
        //initialise variables
        let ArrayToPush = []
        let keyArray = []
        let count = 0
        let keyPosition = 0
        //appends key to smaller keys
        for (let j = 0; j<keySetClient[i].length;j++){
            //every 10 bits , start a new array
            if (count >= keySegmentLength ){
                keyArray.push(ArrayToPush)
                count = 0
                keyPosition+=1
                ArrayToPush = []
            }
            //adds each bit to array
            ArrayToPush.push( keySetClient[i][j])
            count+=1
            //this just adds the very last bit to be added
            if(j == keySetClient[i].length-1){
                keyArray.push(ArrayToPush)
            }
        }
        // does that maths
        for(let j = 0;j<keyArray.length;j++){
            keyArray[j] = keyMaths(keyArray[j] , g , N)
        }
        // appends back into array
        key.push(keyArray)
    }
    return key
}