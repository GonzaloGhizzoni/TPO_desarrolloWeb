from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask,jsonify, request
from flask_cors import CORS
import mysql.connector
import hashlib

app = Flask(__name__) 
CORS(app)

class User(): 
    # Constructor de la clase
    def __init__(self, host, user, password, database):
        # Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
            self.cursor.execute('SHOW DATABASES')

            for db in self.cursor:
                print("databases", db);
            print("conecto")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                birthdate DATE NOT NULL,
                password VARCHAR(64) NOT NULL)''')
            self.conn.commit()
            self.cursor.execute('SHOW TABLES')
            for tables in self.cursor:
                print("tables",tables);
                print("creo la tabla");
        except mysql.connector.Error as err:
            raise err

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        


    #Log in a user with provided email and password
    def login(self,email, password):
        try:
            #Hash the password to compare
            hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            
            self.cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email,hashed_password))
            user = self.cursor.fetchone()
            
            if user:
                return {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name'],
                    'surname': user['surname'],
                    'birthdate': user['birthdate']
                }
            else:
                return None
        except mysql.connector.Error as error:
            raise error

    #Registers a new user if the email is unique and the user is 18 or older (legal age)
    # @app.route('/register/<email>/<password>/<name>/<surname>/<birthdate>', methods=["POST"]) 
    def register(self, email, name, surname, birthdate, password) :     
        try:   
            #Hash the password before storing
            hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            
            #In case both if are completed adds a new user
            sql = "INSERT INTO users ( email, name, surname, birthdate, password) VALUES (%s, %s, %s, %s, %s)"
            values = (email, name, surname, birthdate, hashed_password)
            self.cursor.execute(sql, values)
            self.conn.commit()
            
            # Verificar si la fila se ha insertado
            if self.cursor.rowcount == 1:
                return True
            else:
                return False
        except mysql.connector.Error as error:
            print(f"Error: {error}")
            return False;

    #Method to check if email already exist
    def searchEmail(self,email):
        try:
            sql = "SELECT * FROM users WHERE email = %s"     
            self.cursor.execute(sql, (email,))
            # Directly return the boolean value from fetchone()
            return self.cursor.fetchone()
        except mysql.connector.Error as error:
            raise error

    #Method to check if age is at least 18
    def legalAge(self,birthdate):
            # create today date variable
            today = datetime.today()
            birthdate_date = datetime.strptime(birthdate, "%Y-%m-%d")
            age = relativedelta(today, birthdate_date).years
            return age >= 18

    #Return all users 
    def getUsers(self):
        self.cursor.execute("SELECT * FROM users");
        return self.cursor.fetchall();


#Local connection
user = User(host='localhost', user='root', password='1234', database='newDatabase')\

#Prod connection 
# user = User(host='nahuelgr.mysql.pythonanywhere-services.com', user='nahuelgr', password='mahaloDB', database='nahuelgr$mahalo')

@app.route('/register', methods=["POST"])
def register():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    surname = data.get('surname')
    birthdate = data.get('birthdate')
    password = data.get('password')
    
    if user.searchEmail(email):
        return jsonify({'error': 'Email already exists'}), 400

    if not user.legalAge(birthdate):
        return jsonify({'error': 'User is under 18 years old'}), 400

    if user.register(email, name, surname, birthdate, password):
        return jsonify({'success': 'User registered'}), 200
    else:
        return jsonify({'error': 'Failed to register user'}), 400

@app.route('/login', methods=["POST"]) 
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    userLogged = user.login(email,password)
    if userLogged:
        return jsonify(userLogged)
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/users', methods=["GET"]) 
def getUsers():
    users = user.getUsers();
    return jsonify(users)

if __name__=='__main__': 
        app.run(debug=True)   
