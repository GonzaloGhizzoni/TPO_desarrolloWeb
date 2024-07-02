import mysql.connector



class Turnero:



    def __init__(self, host, user, password, database):
        """
        Inicializa una instancia de Catalogo y crea una conexión a la base de datos.

        Args:
            host (str): La dirección del servidor de la base de datos.
            user (str): El nombre de usuario para acceder a la base de datos.
            password (str): La contraseña del usuario.
            database (str): El nombre de la base de datos.
        """
        # Primero, establecemos una conexión sin especificar la base de datos. self.conn es un atributo de la clase que representa una conexión activa a una base de datos.
        self.conn = mysql.connector.connect(
            host = host,
            user = user,
            password = password
        )



    turnos = [] 

    #AGREGARTURNO------------------------------------------
    def solicitar_turno(self, nombre, email, especialidad, fecha, hora):
        if self.consultar_turno(email):
            return False
        
        nuevo_turno = {
            'nombre': nombre,
            'email': email,
            'especialidad': especialidad,
            'fecha': fecha,
            'hora': hora
        } 
        self.turnos.append(nuevo_turno)
        return True



    #CONSULTARTURNO----------------------------------------
    def consultar_turno(self, email):
        for turno in self.turnos:
            if turno ['email'] == email:
                return turno
        return False
        


    #MODIFICARTURNO----------------------------------------
    def modificar_turno(self, nuevo_nombre, email, nueva_especialidad, nueva_fecha, nueva_hora):
        for turno in self.turnos:
            if turno['email'] == email:
                turno['nombre'] = nuevo_nombre
                turno['especialidad'] = nueva_especialidad
                turno['fecha'] = nueva_fecha
                turno['hora'] = nueva_hora
                return True
        return False



    #LISTAR TURNOS
    def listar_turnos(self):
        print("-" * 50)

        for turno in self.turnos: 
            print(f"nombre.........: {turno['nombre']}") 
            print(f"email..........: {turno['email']}") 
            print(f"especialidad...: {turno['especialidad']}") 
            print(f"fecha..........: {turno['fecha']}") 
            print(f"hora...........: {turno['hora']}")
            print("-" * 50) 



    #ELIMINARTURNOS----------------------------------------
    def eliminar_turno(self, email): 
        for turno in self.turnos: 
            if turno['email'] == email: 
                self.turnos.remove(turno) 
                return True 
        return False 

 
turnero = Turnero()


turnero.solicitar_turno('macarena', 'maca@gmail.com', 'unas', 29.02, '10am')
turnero.solicitar_turno('cecilia', 'ceci@gmail.com', 'pelo', '2233', '22333')
turnero.solicitar_turno('teresa', 'teresa@gmail.com', 'pelo', 2324, 242322)
turnero.solicitar_turno('emanuel', 'ema@gmail.com', 'unas', 2222, 2222)

turnero.listar_turnos()