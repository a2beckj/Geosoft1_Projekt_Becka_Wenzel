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
- mongodb 3.5.9
- body-parser 1.19.0

Die Geometrie der Fahrten wird über die API nicht bereitgestellt. Daher ist es nicht möglich gewesen, diese in der Karte darszustellen.
Nur die Haltestellen, an denen Fahrten genommen wurden, werden in der Karte dargestellt.
Informationen zu Fahrten und Risikostatus sind in der tabellarischen Ansicht sichtbar und auswählbar.

Verwenden der APP:
Zunächst muss man sich Registrieren, danach kann man sich mit angegebenem Namen und Passwort wieder anmelden. Der Name des eingeloggten Nutzers ist auf allen Seiten ersichtlich.

Ein normaler Nutzer wird auf die Seite der Bushaltestellenanzeige weitergeleitet. Falls der Nutzer eine Risikofahrt getätigt hat, wird ihm das hier durch durch ein Popup angezeigt. Auf dieser Seite hat er die Möglichkeit, den aktuellen Standort abzurufen und sich daraufhin nahe gelegene Bushaltestellen anzeigen zu lassen oder auf vordefinierte Standorte in Münster zurückzugreifen. 
Bei dem Klick auf eine Bushaltestelle in der Karte werden in einer tabellarischen Ansicht alle ausgehenden Bus- und Bahnverbindungen angezeigt. Diese können in der Tabelle ausgewählt und mit dem Klick auf den Button an die Datenbank übergeben werden. Der Nutzer kann pro Bushaltestelle nur eine Verbindung wählen. 
Über den Reiter 'Rides Taken' kann der Nutzer seine getätigten Fahrten einsehen. Fahrten, die mit einem Risiko versehen sind, werden in der tabellarischen Ansicht rot hinterlegt. Die demsensprechenden Einstiegs-Haltestellen werde in der Karte mit einem roten Kreis dargestellt. Risikofreie Haltestellen als blaue Marker.

Ein Arzt wird auf die spezielle Ärzte-Website weitergeleitet, in welcher er Fahrten als Risiko markieren kann, in dem er sich alle Fahrten aus der Datenbank über den Button 'show all rides' anzeigen lässt. Bei Anwählen einer angezeigten Haltestelle in der Karte werden ihm in der tabellarischen Ansicht alle von dort getätigten Fahrten angezeigt. Diese kann er beliebig auswählen und über den Button in der Datenbank als Risiko markieren und abspeichern. Ebenso ist es möglich ganze Nutzer in der Datenbank als Risiko zu markieren, aber das Risiko auch wieder zurück zu nehmen. Hierzu gibt er im Textfeld den Namen des Nutzers ein und wählt entweder zwischen 'mark patient's rides as risk' oder 'Unmark patient's rides as risk'.

Über den Logout Button wird man zur LoginRegister Webiste weitergeleitet.


Link zu GitHub repository: https://github.com/a2beckj/Geosoft1_Projekt_Becka_Wenzel/