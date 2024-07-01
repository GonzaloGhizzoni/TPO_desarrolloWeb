from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask,jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__) 
CORS(app)

class Appointment():
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
                CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT (10) NOT NULL,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                hour VARCHAR(255) NOT NULL,
                date_of_appointment DATE NOT NULL,
                specialties VARCHAR(255) NOT NULL)''')
            self.conn.commit()
            # self.cursor.execute('SHOW TABLES')
            # for tables in self.cursor:
            #     print("tables",tables);
            #     print("creo la tabla");
            # Specify the table name
            # table_name = "appointments"

            # # Execute the query to get table information
            # self.cursor.execute(f"DESCRIBE {table_name}")

            # # Fetch the column descriptions
            # column_descriptions = self.cursor.fetchall()

            # # Print the column names
            # print("Columns:")
            # for description in column_descriptions:
            #     print(f"- {description[0]} ({description[1]})")
        except mysql.connector.Error as err:
            raise err

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
    
    def getAppointments(self):
        self.cursor.execute("SELECT * FROM appointments");
        return self.cursor.fetchall();
    
    def getUserData(self,email):
        try:
            sql = "SELECT * FROM users WHERE email = %s"     
            self.cursor.execute(sql, (email,))
            # Directly return the boolean value from fetchone()
            return self.cursor.fetchone()
        except mysql.connector.Error as error:
            raise error
    
    def newAppointment(self,email,name,hour,dateOfAppointment,specialties):
        # traigo TODA la informacion del usuario
        # ya tiene autocompletado email y nombre porq lo tengo en el objeto, puedo hacer un objeto usuario
        # que tenga los datos con un metodo que vaya a buscar a la base
        # en la base tengo que guardar nada mas, el user id para poder traer despues en otro metodo 
        # los turnos que son de ese usuario
        try:            
            # user_data = getUserData(email)
            # Extract user ID from the returned dictionary
            # user_id = user_data['id']  # Assuming 'id' is the column name for user ID
            # print(user_data)
            # print(user_id)
            sql = "INSERT INTO appointments (user_id,email,name,hour,date_of_appointment,specialties) VALUES (%s, %s, %s, %s, %s, %s)"
            values = (1, email, name, hour, dateOfAppointment, specialties)
            self.cursor.execute(sql, values)
            self.conn.commit() 

            # Check if insert is okay
            if self.cursor.rowcount == 1:
                return True
            else:
                return False
        except mysql.connector.Error as error:
            raise error
    
    def getUserAppointments(self,userID):
        # hago una consulta que coincida el user id por param con el user id de la tabla
        # trago todo lo que coincida
        try:
            self.cursor.execute("SELECT * FROM appointments WHERE user_id = %s",(userID,))
            return self.cursor.fetchall();
        
        except mysql.connector.Error as error:
            raise error        
    
    def cancelAppointment(self,appointmentID):
        # recibo el id del appointment para cancelar
        try:
            self.cursor.execute("DELETE FROM appointments WHERE id = %s",appointmentID)
            self.conn.commit()
            return self.cursor.rowcount > 0
        
        except mysql.connector.Error as error:
            raise error  
    
    def modifyAppointment(self,appointmentID, newHour, newDateOfAppointment, newSpecialties):
        try:
            sql = "UPDATE appointments SET hour = %s, date_of_appointment = %s, specialties = %s WHERE id = %s"
            valores = (newHour, newDateOfAppointment, newSpecialties, appointmentID)
            self.cursor.execute(sql, valores)
            self.conn.commit()
            return self.cursor.rowcount > 0
        except mysql.connector.Error as error:
            raise error  


#Local connection
appointment = Appointment(host='localhost', user='root', password='1234', database='newDatabase')


@app.route('/appointments', methods=["GET"])
def getAllAppointments():
    appointments = appointment.getAppointments()
    if not appointments:
        return jsonify([]), 204  # No Content status code
    else:
        return jsonify(appointments);

@app.route('/newappointment', methods=["POST"])
def addNewAppointment():
    data = request.json
    # email = data.get('email')
    # name = data.get('name')
    hour = data.get('hour')
    dateOfAppointment = data.get('dateOfAppointment')
    specialties = data.get('specialties')
    
    # print(email)
    # print(name)
    print(hour)
    print(dateOfAppointment)
    print(specialties)
    
    if appointment.newAppointment("nahuelgonzalez07@hotmail.es","nahuel gonzalez",hour,dateOfAppointment,specialties):
        return jsonify({'Success': 'Appointment added'}), 200
    else:
        print("entro aca y dio error")
        return jsonify({'Error': 'Failed to added appointment'}), 500

@app.route('/userappointment', methods=["POST"])
def getUserAppointment():
    data = request.json
    userID = data.get('userID')
    appointments = appointment.getUserAppointments(userID)
    print(appointments)
    if not appointments: 
        return jsonify([]), 204
    else:
        return jsonify(appointments), 200;

@app.route('/cancelappointment', methods=["DELETE"])
def cancelAppointment():
    if appointment.cancelAppointment():
        return jsonify({"Success": "appointment canceled ok " }), 200
    else:
        return jsonify({"Error": "Error in method cancel appointment"}), 500    

@app.route('/modifyappointment', methods=["PUT"])
def modifyAppointment():
    data = request.json
    appointmentID = data.get('appoinmentID')
    newHour = data.get('email')
    newDateOfAppointment = data.get('name')
    newSpecialties = data.get('surname')
    
    if appointment.modifyAppointment(appointmentID,newHour,newDateOfAppointment,newSpecialties):
        return jsonify({'Success': 'Appointment modified'}), 200
    else:
        return jsonify({'Error': 'Failed to modified appointment'}), 500

if __name__=='__main__': 
        app.run(debug=True)   

