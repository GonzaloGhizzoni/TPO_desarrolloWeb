from datetime import datetime
from dateutil.relativedelta import relativedelta

# define a dic list for users storage
users = []
# create today date variable
today = datetime.today()

def register(email,password,username,surname,birthdate) :

    if searchEmail(email):
        return False
    if legalAge(birthdate):
        return True

    newUser = {
        'email' : email,
        'password' : password,
        'username' : username,
        'surname' : surname,
        'birthdate': birthdate
    }

    users.append(newUser)
    return True

def searchEmail(email):
    for user in users:
        if user ['email'] == email:
            return True
        return False
    
def legalAge(birthdate):
    result = relativedelta(today,birthdate)
    if result >= 18:
        return True