#  LLM would be introduced here through API.  Ollama works with a running software installed on the desktop while OpenAI works through API.

# depending on if the user is going with OpenAi or Ollama will determine how we go about this process.
class Session:
    def __init__(self, authorized=False):
        self.authorized=False

    def get_api(self):
        print("Connects to the online API - like OpenAi")

    def connect_to_local_llm(self):
        print("Connects to the local LLM - like Ollama")

#  API Object
Session = Session('Not Authorized')

#  User would be authorized by a 3rd party if possible - something like OAuth -
class User:
    def __init__(self, name, authcode):
        self.name=name
        self.authcode=authcode

# Chat interface for the LLM
class Interface:
    def __init__(self, name):
    	self.name=name

    def start(self, status=False):
    	print(f'Greetings {self.name}!')
    	while status!='q':
    		status=input('What would you like to do?')

    	print('Thank you for using the user interface')

class Data:
    
    def __init__(self, name):
        self.name=name

    def authorize_data(self):
        print("This should allow the user to access their data from a cloud or local storage")

    def access_cloud(self):
        print("This should allow the user to access their cloud data")

    def access_local(self):
        print("This should allow the user to access their data locally")

#  Interface Oject
a=Interface('User Guest')

a.start()