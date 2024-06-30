from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask,jsonify
from flask_cors import CORS


app = Flask(__name__) 
CORS(app)

users = [{
            'email' : "nahuelgonzalez07@hotmail.es",
            'password' : "1234",
            'username' : "sdnadsa",
            'surname' : "dsadasdas",
            'birthdate': "29/12/1998"}
            ]

# def index(): 
#     return render_template('empleados/index.html') 

@app.route('/users', methods=["GET"]) 
def getUsers():
    print(users)
    return jsonify(users)

@app.route('/login/<email>/<password>', methods=["GET"]) 
def login(email, password):
    print(email)
    print(password)
    for user in users:
        if user['email'].lower() == email.lower() and user['password'] == password:
            print("User logged");
            return jsonify(user)
    return jsonify({'error': 'Invalid email or password'}), 401


    #Registers a new user if the email is unique and the user is 18 or older (legal age)
@app.route('/register/<email>/<password>/<username>/<surname>/<birthdate>', methods=["POST"]) 
def register(email,password,username,surname,birthdate) :
        print("email: ",email);
        print("pass: ",password);
        print("user: ",username);
        print("surname: ",surname);
        print("birt: ",birthdate);
    #Checks if the email already exist
        if searchEmail(email):
            print("Ya existe")
            return False
    #Cheks if age is at least 18 (Legal age in Argentina)
        if not legalAge(birthdate):
            print("menor de 18")
            return False

    #In case both if are completed adds a new user
        newUser = {
            'email' : email,
            'password' : password,
            'username' : username,
            'surname' : surname,
            'birthdate': birthdate
        }

        users.append(newUser)
        print("user registered \n")
        return jsonify({'success': 'User registered'}), 200
        
#method to check if email already exist in the user list
def searchEmail(email):
        for user in users:
            if user['email'] == email.lower():
                return True
            return False

    #method to check if age is at least 18
def legalAge(birthdate):
        # create today date variable
        today = datetime.today()
        birthdate_date = datetime.strptime(birthdate, "%Y-%m-%d")
        age = relativedelta(today, birthdate_date).years
        return age >= 18
    
if __name__=='__main__': 
        app.run(debug=True)   

    

    #tries to log in a user with provided email and password
# @app.route('/login/<email>/<password>', methods=["GET"]) 
# def login (email, password):
#         for user  in users:
#             if user['email'] == email.lower() and user['password'] == password:
#                 print("User logged");
#                 return jsonify(user);
#         return None





# email = input("Ingrese su email: ")
# password = input("Ingrese su pass: ")
# username = input("Ingrese su name: ")
# surname =  input("Ingrese su surname: ")
# birthdate = input("Ingrese su birth:")

# print("email: ",email);
# print("pass: ",password);
# print("user: ",username);
# print("surname: ",surname);
# print("birt: ",birthdate);

# register(email,password,username,surname,birthdate)

# print(users)

# enteredEmail = input("Ingrese su email: ")
# enteredPassword = input("Ingrese su pass: ")
# login(enteredEmail,enteredPassword)


  