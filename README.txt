Title : ColabEdit

About :
->This project is about building a Collaborative editor with the following  functionalities:
    1. Live Code Editor
    2. Chat Box and Drawing Canvas
-> Multi User application using web sockets.
-> Framework Used : Django

How to use the Application?
-> The user will have to first register in the website using an email id.
-> Then user will then have to login with the registered credentials.
-> Then they will have to enter a room number into which that want to get in along with a password,
   which will be shared by the room host.
-> The user after logging in will be able to access the features of chat box, live code editor and the
   drawing canvas which will be synchronized among all the participants in the room.


More about the functionalites:
1. Live code editor:
    Supports python programming.
    Utilized the API Services of Hackerearth.
2. Chat Box and Drawing Canvas:
    Synchronized Chat Box and Drawing Canvas.
    Implemented Websockets with the help of P5 js

We used web sockets for synchronization among all the users.
Websockets:
-> They allow event-driven communication between web browser and server
-> Great for real-time application
-> Uses TCP
-> Facilitates  real-time data transfer from and to the server.
-> Websocket handshake also takes place which happens in an attempt to upgrade from http protocol to websocket protocol.


Steps to start the development server:
1. Create and Activate a virtual environment using virtualenv
2. After activating the virtual environment install all the requirements
as in the requirements.txt file using the command
"pip install -r requirements.txt"
3. Then run the following command to run the server.
"python manage.py runserver"

We have also deployed the code with the help of heroku:
Link: https://collab-code-edit.herokuapp.com/

NOTE:
If any problem arise while installing with the pakage named "twisted"
please go through the link given below.
Link: https://stackoverflow.com/questions/57000214/how-do-i-pip-install-twisted-without-getting-an-error





