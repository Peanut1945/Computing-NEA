import random

import time

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

def delay():
    # generates a random delay
    # seed = run_register(generate_seed(), 10)
    # time.sleep(int(str(seed) + "5"))
    time.sleep(random.randint(1,9)/100)

def generate_seed():
    #document that this had to be changed as date work diff in python
    timestamp = int(round(time.time()) + (time.time()%round(time.time()))*1000000000000000000000)
    seed = conversion(timestamp)
    seed.replace(" " , "")
    register = list(seed.ljust(104, '0'))
    return register

def run_register(seed, size):
    newRegister = seed.copy()
    length = len(seed)
    randomNumber = []
    # for i in range(length):
    #     seed[i] = int(seed[i])

    for i in range(length):
        # This shifts the register and Xors, but doesn't take an output
        # XOR
        newRegister[length-1] = int(newRegister[0]) ^ int(newRegister[1])
        # Shift
        for j in range(1, length):
            newRegister[j - 1] = newRegister[j]

    # Generates "random" number
    for i in range(size):
        # This shifts the register and Xors; and takes an output
        # Takes output
        randomNumber.append(newRegister[0])
        # XOR
        newRegister[length-1] = str(int(newRegister[0]) ^ int(newRegister[1]))
        # Shift
        for j in range(1, length-1):
            newRegister[j - 1] = newRegister[j]

    return randomNumber

# def create_key(size):
#     #creates a random number
#     number1 = run_register(generate_seed(), size)
#     number2 = []
#     delay()
#     #creates anouther random number
#     number2 = run_register(generate_seed(), size)
#     delay()
#     #creates a random permiatation key
#     permutation_mask = run_register(generate_seed(), size)
#     final_key = []
#     #creates the inverse permiatation key
#     permutation_mask_inv = [1 if bit == 0 else 0 for bit in permutation_mask]
#     #permiates the 2 random numbers , then Xors then and saves them to an array
#     for i in range(size):
#         number1[i] = number1[i] and permutation_mask[i]
#         number2[i] = number2[i] and permutation_mask_inv[i]
#         #makes them into array
#         final_key.append(str(int(number1[i]) ^ int(number2[i])))

#     return final_key

# def keyMaths(key , g , N):
#     #initialises variable
#     keyString = ""

#     # make number into a string
#     for j in range(len(key)):
#         keyString += str(key[j])

#     #does the diffie Helman maths
#     #this takes small prime to the power of our key
#     #and then MODs it by the big prime
#     keyInt = (g**int(keyString, 2))%N
#     #makes into a string
#     keyString = bin(keyInt)[2:] 
#     #makes string an array
#     key = keyString.split(",")
#     return key

import random

def create_key(length):
    if not isinstance(length, int) or length <= 0:
        raise ValueError('Length must be a positive integer')

    binary_number = ''.join(str(random.randint(0, 1)) for _ in range(length))
    return binary_number

def DiffieHellman(key, g, N):
    #makes key into an integer
    key_int = int(key, 2)
    #takes small prime to power of key , then mods by big prime
    key_int = (g**key_int) % N
    # changes into back into a binary string
    key_string = bin(key_int)[2:]
    # turns string into a list
    key_list = list(key_string)
    return key_list
