from flask import Flask, request
from datetime import datetime
import json

app = Flask(__name__)

class User:
    def __init__(self, username, coordinates, event_ids):
        self.username = username
        self.coordinates = coordinates #tuple
        self.events = event_ids

    
    def __eq__(self, other):
        return self.username == other.username
    
    def get_dict(self):
        return {
            "username": self.username,
            "coordinares": self.coordinates,
            "events": self.events
        }
    
    

class Event:
    def __init__(self, id, name, coordinates, dt):
        self.id = id
        self.name = name
        self.coordinates = coordinates #tuple
        self.datetime = dt #datetime
    
    def get_simple_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }

    def get_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.coordinates,
            "members": self.get_members_dict()
        }

    def get_members_dict(self):
        return [ user.get_dict() for user in users if self.id in user.events]


events = dict() #key = id, value = event
users = set()


@app.route('/')
def ep_hello():
    return app.send_static_file('index.html')
    #return 'Hello, World!'

@app.route('/upload/', methods=['POST'])
def ep_upload():
    input = json.loads(request.data)

    user = User(**input)
    users.add(user)

    return "OK"  #request.data #echo


@app.route('/events/', methods=['GET'])
def ep_events():
    output = []
    for event in events.values():
        output.append(event.get_simple_dict())

    return json.dumps(output)


@app.route('/fetch/', methods=['POST'])
def ep_fetch():
    input = json.loads(request.data)

    output = []
    for ev_id in input:
        output.append( events[ev_id].get_dict() )
        
    return json.dumps(output)
