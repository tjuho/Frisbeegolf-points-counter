#Frisbee golf points calculator

Keeps track of the number of throws when you progress the frisbee golf course. It works in the browser and you can input all of your group's points. The points are stored in mongoDB https://www.mongodb.com/ database. This was practice assignment for Helsinki university course Fullstack 2019. There are two frontends available: normal browser frontend and react native frontend to be used with mobile phones. The stack is React + Node.js + Express + MongoDB

##Installing and running the app locally

Node.js is required to run the app.
Clone the repository and run npm install in each of the directories: backend, frontend and reactnative.
The backend is run in its folder with: npm run watch
The frotend is run in its folder with: npm start
React native frontend is run in its folder with: npm start

##Live demo

The app is deployed at http://frisbeegolfappi.herokuapp.com/ but unfortunatly you will need credentials from me to try it out.

##Some remaining issues

Bad mobile phone connection might cause some unresponsivness when storing the points to the backend database.
There is no signup system at the moment.
The look and feel of the frontends are very basic and would require more work if the app would be made open to public.
Testing was very basic.

##Finnish dercription below

Frisbeegolf pistelaskuri. Harjoitustyö Fullstack 2019 kurssiin.

Selain applikaatio löytyy osoitteesta:
http://frisbeegolfappi.herokuapp.com/

React native käyttöliittymä löytyy osoitteesta (ei toimi enää/not working anymore):
~~https://expo.io/@krooh/frisbeegolfapp~~

Backend, frontend ja react native frontend voidaan ajaa myös lokaalisti normaalisti kloonaamalla repo ja asentamalla ne ajamalla komento npm install kussakin hakemistossa.

Backend voidaan ajaa lokaalisti komennolla npm run watch
Frontend voidaan ajaa lokaalisti komennolla npn start
React native frontend voidaan ajaa lokaalisti komennolla npm start
