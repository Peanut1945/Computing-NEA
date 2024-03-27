from flask import Flask, render_template , request , redirect , jsonify, url_for , flash
import sqlite3 , os
from PythonEncryption import CreateKey as ck , FiestelCypher as Cypher

import json
# import numpy as np

encrypIter = 10

app = Flask(__name__)

#create a new user in the database
def addUser(User,Password):
    #establishes connection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    #adds new keyset
    cursor.execute("""INSERT INTO keySet VALUES(?,?,?,?,?,?,?,?,?,?,?)""",(None ,1,None,None ,None,None,None ,None,None,None,None))
    #stores keyset id so we can reference it
    cursor.execute(""" SELECT KeySetID FROM keySet WHERE KeyOne = 1""")
    KeySetID = cursor.fetchone()
    #makes a new record in user
    cursor.execute(""" INSERT INTO User VALUES(?,?,?) """, (User,Password, KeySetID[0]))
    #chages one back to null so we dont pick it up later
    cursor.execute(""" UPDATE keySet SET KeyOne = NULL WHERE KeyOne = 1 """)
    # commits and closes the connection
    connection.commit()
    connection.close()

def FetchPassword(UserName):
    #extablishes connection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    #finds password
    cursor.execute("""  SELECT Password FROM User WHERE UserName = ?""",(UserName,))
    #saves password
    SavedPas = cursor.fetchone()
    #takes the returned tuple
    #and converts it into a string
    Saved = str(SavedPas[0])
    connection.commit()
    connection.close()
    return Saved


#adds message to database
def SaveMessage(Sender , recipient , message):
    #establishes connection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    print("connection established")
    #inserts the message , sender and recipient into the databse
    cursor.execute(""" INSERT INTO Message VALUES(?,?,?,?)""",(None,Sender , recipient , message))
    #commits changes
    connection.commit()
    connection.close()
    
#find messages
def fetchMessages(recipient):
    #establishes connection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    #selects whole record , of the message
    cursor.execute(""" SELECT * FROM message WHERE recipient = ?""",(recipient,))
    #fetches all of the fields
    Messages = cursor.fetchall()
    connection.commit()
    connection.close()
    #returns the messages so they can be sent to the user
    return Messages

def setKeySet(User,key1,key2,key3,key4,key5,key6,key7,key8,key9,key10):
    #establish conection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    #find User
    cursor.execute(""" SELECT keySetID FROM User WHERE UserName = ? """,(User,))
    KeySet = cursor.fetchone()
    #places each of the keys into the databse
    cursor.execute(''' UPDATE keySet SET KeyOne = ?,
                    keyTwo = ?,
                    keyThree = ?,
                    keyFour = ?,
                    keyFive = ?,
                    keySix = ?,
                    keySeven = ?,
                    keyEight = ?,
                    keyNine = ?,
                    keyTen = ?
                    WHERE keySetID = ?''',(key1,key2,key3,key4,key5,key6,key7,key8,key9,key10,KeySet[0]))
    connection.commit()
    connection.close()

def getKeySet(User):
    #establish conection
    connection = sqlite3.connect("Data.db")
    cursor = connection.cursor()
    #find User
    cursor.execute(""" SELECT keySetID FROM User WHERE UserName = ? """,(User,))
    KeySet = cursor.fetchone()
    cursor.execute(""" SELECT keyOne,
                    keyTwo,
                    keyThree,
                    keyFour,
                    keyFive,
                    keySix,
                    keySeven,
                    keyEight,
                    keyNine,
                    keyTen  
                    FROM keySet WHERE keySetID = ?""",(KeySet[0],))
    keys = cursor.fetchall()
    return keys[0]

def moveKeySet(User):
    keySet = getKeySet("SignedOut")
    setKeySet(User , keySet[0],keySet[1],keySet[2],keySet[3],keySet[4],keySet[5],keySet[6],keySet[7],keySet[8],keySet[9],)
    
def toString(array):
    string = ""
    for i in range(len(array)):
        string += array[i]
    return(string)





#takes the / route and opens the home page
@app.route("/" , methods = ["POST" , "GET"]) 
def Home():
    User = request.cookies.get("User")
    if User == None:
        return redirect("/login")
    return render_template("Home.html")

@app.route("/Messages" , methods = ["POST" , "GET"])
def Messages():
    #gets User name from cookies
    User = request.cookies.get("User")
    #if no username cookie is found
    if User == None:
        #we redirect them to the login path as they are not logged in
        return redirect("/login")
    
    #get keyset of the User
    keySet = list(getKeySet(User))

    Messages = fetchMessages(User)
    Messages_send = {}

    for i in range(len(Messages)):
        Message_name = "message" + str(i)
        New_message = {
            Message_name:Cypher.encrypt(Messages[i] , encrypIter , keySet),
        }
        Messages_send.update(New_message)

    return jsonify(Messages_send)


@app.route("/login" , methods = ["POST" , "GET"])
def login():
    if request.method == "POST":
        Data = request.json

        #because we are using a chain of promises on the front end
        #here i can search the keyset thats been put in "limbo"
        keySet = list(getKeySet("SignedOut"))
        #here we decrypt the username and password that have been sent over
        User = Cypher.decrypt(Data.get("User"), encrypIter ,keySet )
        Password = Cypher.decrypt(Data.get("Password"),encrypIter , keySet)

        try:
            #we try to fetch the password of the User
            SavedPas = FetchPassword(User)
        except:
            #if we cant find it it means the User name was wrong
            print("failed to find password")
            #returns False to let the front end know 
            return "False"
        #if we have the password we check it against the User inputed password
        if SavedPas == Password:
            # if the password has passwd we move it to the user to allow
            # the use of it for there session.
            moveKeySet(User)
            # we then return the user to allow it to but used in the session cookies
            return User
        return "False"
    else:
        return render_template("Login.html")


#takes the /sign-up route and runs the follwoing code
@app.route("/sign-up" , methods = ["POST" , "GET"])
def signUp():
    #if we are posting , it will take in a form
    if request.method == "POST":
        Data = request.json
        # we get the keyset so we can de-crypt the Data
        keySet = list(getKeySet("SignedOut"))
        # decrypt Username and password
        User = Cypher.decrypt(Data.get("User"), encrypIter ,keySet )
        Password = Cypher.decrypt(Data.get("Password"),encrypIter , keySet)
        #this trys to add new user to datbase
        try:
            # adds user to the databse
            addUser(User , Password)
            #if this works it will return a message to the server of True to indicate everything worked
            return "True"
        except:
            #if this has not worked it catches the error and lets the front end know
            #that there is already this user name.
            print("already a user name")
        #returns the Signup page
        return render_template("sign-up.html")
    # if it is a get request , we just load the page
    else:
        return render_template("sign-up.html")


@app.route("/send" , methods=["POST" , "GET"])
def sendMessage():
    #get cookie from user
    User = request.cookies.get("User")
    #if they are not signed in (have no user cookie)
    if User == None:
        #return them to the login page
        return redirect("/login")

    if request.method == "POST":
        Data = request.json
        #get key set
        keySet = list(getKeySet("SignedOut"))
        #fetch and decode form
        Message = Cypher.decrypt(Data.get("Message"), encrypIter ,keySet )
        Recipient = Cypher.decrypt(Data.get("Recipient"), encrypIter ,keySet )
        #if we can fetch the password , we know that the user exists
        try:
            Testing = FetchPassword(Recipient)
            #if the user does not exist
        except:
            #we return false
            return "False"
        #add message to databse
        SaveMessage(User , Recipient , Message)
        #return "sent" to confirm that the data has been added to the databse
        return "sent"
    #if it is not a post request , we load the webpage.
    return render_template("SendMessage.html")


@app.route("/ExNone" , methods = ["POST" , "GET"])
def exNone():
    g = 3
    N = 31
    Data = request.json
    
    #get client keys that have been sent over
    keySetClient = [Data.get("keyOne") , Data.get("keyTwo") ,Data.get("keyThree") ,Data.get("keyFour") ,Data.get("keyFive") ,Data.get("keySix") ,Data.get("keySeven") ,Data.get("keyEight") ,Data.get("keyNine") ,Data.get("keyTen") ,]
    #get the length that the keys need to be from the front end
    keyLength = Data.get("Length")
    #generate 10 keys
    keySetServer = [ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength),ck.create_key(keyLength)]
    
    #power and modulous aka DiffieHellman maths

    for i in range(len(keySetServer)):
        #this sets the key set to the computated keys 
        #(this is the fist round of Diffiehellman)
        keySetServer[i] = ck.DiffieHellman(keySetServer[i],g,N)

    #this will save out keyset so we can use it later
    #as this will be the set we send over 
    setKeySet("SignedOut" , ''.join(keySetServer[0]),''.join(keySetServer[1]),''.join(keySetServer[2]),''.join(keySetServer[3]),''.join(keySetServer[4]),''.join(keySetServer[5]),''.join(keySetServer[6]),''.join(keySetServer[7]),''.join(keySetServer[8]),''.join(keySetServer[9]))
    

    for i in range(len(keySetServer)):
        #here we finnish the second round
        keySetServer[i] = ck.DiffieHellman(''.join(keySetServer[i]), int(''.join(keySetClient[i]), 2),N)
        
        while len(keySetServer[i]) < 5:
            #corrects the number of zeros
            keySetServer[i].insert(0, "0")
            
    #gets the keyset we saved so we can send it
    keySetSend = getKeySet("SignedOut")
    
    #append key set to databse
    #but it will be saved to a SignedOut user as we have not got 
    #a user to asign it to. But this should be fine as we use promises
    setKeySet("SignedOut" , ''.join(keySetServer[0]),''.join(keySetServer[1]),''.join(keySetServer[2]),''.join(keySetServer[3]),''.join(keySetServer[4]),''.join(keySetServer[5]),''.join(keySetServer[6]),''.join(keySetServer[7]),''.join(keySetServer[8]),''.join(keySetServer[9]))
    return jsonify(keySetSend)

#we need to get the key , make a new key 
#combine them m then return them
#we will have a set person for just unsigned in perople
#we will get there saved key , and make new ones





if __name__ == "__main__":
    app.run(debug=True)