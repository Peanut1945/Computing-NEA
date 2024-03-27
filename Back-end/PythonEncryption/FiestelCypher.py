


def conversion(info):
    binary_val = ""
    ascii_val = ""

    info = str(info)

    for char in info:
        current_letter = ord(char)
        ascii_val += str(current_letter) + " "
        current_letter = bin(current_letter)[2:]

        while len(current_letter) < 8:
            current_letter = "0" + current_letter

        binary_val += current_letter

    return binary_val

def split(binary_val):
    # defines start and end as lists
    start = []
    end = []
    
    # finds the halfway point
    mid_point = len(binary_val) // 2
    array = list(binary_val)
    
    # appends the start and end as lists
    for i in range(mid_point):
        start.append(array[i])
    
    for j in range(mid_point, len(binary_val)):
        end.append(array[j])
    
    
    return [start, end]

def Xor(start, end):
    # initializes result locally
    # print(start , "start")
    # print("end" ,end)
    result = []
    # sets each item to the Xor result
    # does it for the length of start, so when we use a key, it will only do it to the required length
    for i in range(len(start)):
        result.append(str(int(start[i]) ^ int(end[i])))

    return result


def BinaryToLetters(binary):
    # initializes variables
    current = ""
    ascii_val = ""

    # this takes every 8 digits, adds them to a string, and then turns them into a decimal number
    for i in range(len(binary)):
        if len(current) == 8:
            ascii_val += chr(int(current, 2))
            current = ""
        current += binary[i]
    ascii_val += chr(int(current, 2))
    print(ascii_val)

    # # turns the ASCII values into a list
    # ascii_val = ascii_val.split()

    # # takes each item in the list and turns it back into a character
    # return_msg = ""
    # for i in range(len(ascii_val)):
    #     return_msg += ascii_val[i]
    

    return ascii_val



def Cypher(start , end , iterations , typeOf , keySet):
    #initilazie vaiables
    new_start = []
    new_end = []
    #if we are encrypting , we run this part
    if typeOf == "en":
        #performs the cypher
        for i in range(iterations):
            new_start = end
            #here we standardise the length of the key
            while len(keySet[i]) < len(end):
                keySet[i] += keySet[i]
            #here we make the string into an array so it can be used in the Xor function
            keyAsArray = [char for char in keySet[i]]
            #Xor
            end = Xor(end , keyAsArray)
            new_end = Xor(start , end)
            #makes sure we know where each result goes
            start = new_start
            end = new_end
    else: 
        for i in range(iterations , 0 , -1):
            new_start = end
            #here we standardise the length of the key
            while len(keySet[i-1]) < len(end):
                keySet[i-1] += keySet[i-1]
            #here we make the string into an array so it can be used in the Xor function
            #this needs to be indexed as one less then i as i will stop at one
            #and start at ten instead of zero and nine respectivly.
            keyAsArray = [char for char in keySet[i-1]]
            end = Xor(end , keyAsArray)
            new_end = Xor(start , end)
            #makes sure we know where each operation goes
            start = new_start
            end = new_end
    return[start , end]

def encrypt(info, iterations , keySet):
    # Set the type of cipher to encryption
    typeOf = "en"
    
    # Initialize variables
    new_message = []
    plain_text = []
    
    # Change message into binary
    info = conversion(info) 
    
    # Get the plain text we want and split it into two parts
    plain_text = split(info) 
    start = plain_text[0]
    end = plain_text[1]

    # Run the Feistel cipher and parse the number of times it's going to run
    message = Cypher(start, end, iterations, typeOf ,keySet )  

    # Turn start and end into one array
    new_message = message[0] + message[1]
    
    return new_message

def decrypt(info, iterations , keySet):
    
    # Set cipher type to decryption
    typeOf = "de"
    
    # Initialize variables
    original_text = ""
    start = []
    end = []
    
    # Split the input array into two other arrays
    mid_point = len(info) // 2
    start = info[:mid_point]
    end = info[mid_point:]
    
    # We need to re-run the encryption to decrypt, so we call the Feistel cipher
    # but we need to switch the start and end
    plain = Cypher(end, start, iterations, typeOf , keySet) 

    # Concatenate into one string ready to be converted to letters
    for i in range(len(plain[0]) * 2):
        if i < len(plain[0]):
            original_text += plain[1][i]
        else:
            original_text += plain[0][i - len(plain[1])]

    # Make the ASCII code into its plain text so we can read it
    
    plain = BinaryToLetters(original_text) 
    
    return plain

tempKeySet = [ '10010', '00101', '00110', '11001', '10011', '00101', '01000', '10000', '11001', '00001' ]

