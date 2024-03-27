def DiffieHelman(keySetClient):
    keySegmentLength = 5
    key = []
    #small prime number
    g = 3
    #large prime number
    N = 31
    for i in range(len(keySetClient)):
        ArrayToPush = []
        keyArray = []
        count = 0
        keyPosition = 0
        for j in range(len(keySetClient[i])):
            if count >= keySegmentLength:
                keyArray.append(ArrayToPush)
                count = 0
                keyPosition += 1
                ArrayToPush = []
            ArrayToPush.append(keySetClient[i][j])
            count += 1
            if j == len(keySetClient[i]) - 1:
                keyArray.append(ArrayToPush)
        for j in range(len(keyArray)):
            keyArray[j] = keyMaths(keyArray[j], g, N)
        key.append(keyArray)
    return key

def CombineArrays(keySet):
    keyString = ""
    for i in range(len(keySet)):
        for j in range(len(keySet[i])):
            keyString += keySet[i][j]

    return keyString


def DiffieHelmanTwo(keySetClient, g, N):
    gString = ""

    # turns g into a string
    for j in range(len(g)):
        gString += str(g[j])

    # turns g into a BigInt
    g = int(gString, 2)

    # turns key into 10 smaller keys
    keySegmentLength = 5
    key = []
    ArrayToPush = []
    keyArray = []
    count = 0
    keyPosition = 0

    # appends key to smaller keys
    for j in range(len(keySetClient)):
        # every 10 bits, start a new array
        if count >= keySegmentLength:
            keyArray.append(ArrayToPush)
            count = 0
            keyPosition += 1
            ArrayToPush = []

        # adds each bit to array
        ArrayToPush.append(keySetClient[j])
        count += 1

        # this just adds the very last bit to be added
        if j == len(keySetClient) - 1:
            keyArray.append(ArrayToPush)

    # does the maths
    for j in range(len(keyArray)):
        print(DiffieHelmanTwo)
        keyArray[j] = keyMaths(keyArray[j], g, N)

    return keyArray