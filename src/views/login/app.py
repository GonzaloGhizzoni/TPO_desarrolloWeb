from datetime import datetime
from dateutil.relativedelta import relativedelta

# create today date variable
today = datetime.today()


class userList:
    users = []

def register(self,email,password,username,surname,birthdate) :

#Checks if the email already exist
    if self.searchEmail(email):
        return False
#Cheks if age is at least 18 (Legal age in Argentina)
    if self.legalAge(birthdate):
        return True

#In case both if are completed adds a new user
    newUser = {
        'email' : email,
        'password' : password,
        'username' : username,
        'surname' : surname,
        'birthdate': birthdate
    }

    self.users.append(newUser)
    return True

#method to check if email is already in use
def searchEmail(self, email):
    for user in self.users:
        if user['email'] == email:
            return True
        return False

#method to check if age is at least 18
def legalAge(self, birthdate):
    result = relativedelta(today, self.birthdate)
    if result >= 18:
        return True

