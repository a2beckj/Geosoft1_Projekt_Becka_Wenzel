# Geosoft1 Projektabgabe Becka Wenzel

Autoren: Judith Becka, Felix Wenzel

API-Keys: wurden von developers Here bereitgestellt. Wir nutzen ausschließlich die developers here public transit API.
Der Key ist in einer tonkens.js im public ordner eingebunden. Die Variable heisst api_key.


Mongo Datenbank heisst geosoft1 mit den collections 'user' für die Nutzerkontrolle und 'rides' für die Farten.
Starten der App über localhost:3000/userControl. Hier kann man sich dann einloggen/registrieren

Verwendete Bibliotheken:
- leaflet 1.6.0
- bootstrap 4.5.0
- jquery 3.5.1
- express 4.17.1
- express-session 1.17.1
- mongodb 3.5.7
- body-parser 1.19.0

Die Geometrie der Fahrten wird über die API nicht bereitgestellt. Daher ist es nicht möglich gewesen, diese an der Karte darszustellen.
Nur die Haltestellen, an denen Fahrten genommen wurden, werden in der Karte dargestellt.
Informationen zu Fahrten und Risikostatus sind in der tabellarischen Ansicht sichtbar und auswählbar.

Link zu GitHub repository: https://github.com/a2beckj/Geosoft1_Projekt_Becka_Wenzel/

