from datetime import datetime
from dateutil.relativedelta import relativedelta
import hashlib

class userList:
    def __init__(self):
        self.users = []

    #Registers a new user if the email is unique and the user is 18 or older (legal age)
    def register(self,email,password,username,surname,birthdate) :
    #Checks if the email already exist
        if self.searchEmail(email):
            return False
    #Cheks if age is at least 18 (Legal age in Argentina)
        if not self.legalAge(birthdate):
            return False
    
    #Hash the password before storing
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    #In case both if are completed adds a new user
        newUser = {
            'email' : email,
            'password' : hashed_password, #store hashed password
            'username' : username,
            'surname' : surname,
            'birthdate': birthdate
        }

        self.users.append(newUser)
        return True

    #method to check if email already exist in the user list
    def searchEmail(self, email):
        for user in self.users:
            if user['email'] == email.lower():
                return True
            return False

    #method to check if age is at least 18
    def legalAge(self, birthdate):
        # create today date variable
        today = datetime.today()
        age = relativedelta(today, birthdate).years
        return age >= 18

    #tries to log in a user with provided email and password
    def login (self,email, password):
        for user  in self.users:
            if user['email'] == email.lower:
                #Hash the provided password for comparison
                hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
                if user['password'] == hashed_password:
                    return user
        return None
    