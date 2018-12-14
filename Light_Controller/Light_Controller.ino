#include <SPI.h>
#include <ArduinoHttpClient.h>
#include <WiFi101.h>

#include "arduino_secrets.h"

const char ssid[] = SECRET_SSID;
const char pass[] = SECRET_PASS;

int statusCode = 0;
String response;
int count = 0;

WiFiClient netSocket;            // network socket to server
const char server[] = "128.122.6.151";// change server name


int toggleFire = 7;
int toggleRainbow = 6;
int toggleStrobe = 8;
int patternValue;


int colorWheelPin = A2;
int currentColorWheelValue = 0;
int lastColorWheelValue  = 0;
int useColorWheelValue = 0;

int colorVariable;

int potPin = A1;
int potValue;

int speedValue;

int connectionLED = 0; //this LED indicates whether you are connected to the WIFI or not

void setup() {
  Serial.begin(9600);
  pinMode(toggleFire, INPUT_PULLUP);
  pinMode(toggleRainbow, INPUT_PULLUP);
  pinMode(toggleStrobe, INPUT_PULLUP);
  pinMode(colorWheelPin, INPUT);
  pinMode(potPin, INPUT);
  pinMode(connectionLED, OUTPUT);
  // put your setup code here, to run once:

  while ( WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);           // print the network name (SSID)
    WiFi.begin(ssid, pass);
    digitalWrite(connectionLED, LOW);// try to connect
    delay(2000);
  }

  printWifiStatus() ;
}

void loop() {

  HttpClient http(netSocket, server, 3003);

  String route = "/api";

String reading = "{\"speed\":\"" + String(speedValue) + "\", \"hue\":\"" + String(colorVariable) + "\", \"pattern\":\"" + String(patternValue) + "\"}";   
String contentType = "application/json"; // Set the content type
String strangReading = String(reading);



  //"routeFire/routeRainbow/routeStrobe" + "speed=" + potValue + "color=" + wheelValue

  if (digitalRead(toggleRainbow) == LOW) {
 
    patternValue = 1; //rainbow
  }
  else if (digitalRead(toggleFire) == LOW) {
  
    patternValue = 2; //fire

  }
  else if (digitalRead(toggleStrobe) == LOW) {
    patternValue = 3; //strobe

  }
  else {
    patternValue = 0; //nothing
  }

   http.beginRequest();                    // start assembling the request
  http.post(route, contentType, strangReading);
   delay(200);
   

  potValue = analogRead(potPin);
  if (potValue < 340) {
    speedValue = 0;
  } else if (potValue < 680) {
    speedValue = 1;
  } else {
    speedValue = 2;
  }
    http.beginRequest();                    // start assembling the request
    http.post(route, contentType, strangReading);
    delay(200);

  //
  //Serial.println(speedValue);
  //Serial.println(potValue);


  lastColorWheelValue = analogRead(colorWheelPin);
//  Serial.print(currentColorWheelValue);

  if (currentColorWheelValue != lastColorWheelValue) {
    if (currentColorWheelValue > 1 && currentColorWheelValue < 25) {
      //don't update it
    } else {
      //update it
      useColorWheelValue = currentColorWheelValue;

      if (useColorWheelValue > 25 && useColorWheelValue < 341) {
        colorVariable = 0; //blue

      }
      else if (useColorWheelValue > 341 && useColorWheelValue < 680) {
        colorVariable = 2; //white
       
      }
      else if (useColorWheelValue > 681 && useColorWheelValue < 1024) {
        colorVariable = 1; //red
      
      }

      http.beginRequest();                    // start assembling the request
      http.post(route, contentType, strangReading);
      delay(200);
    }
  }

Serial.println(strangReading);

  //Serial.println("last:" lastColorWheelValue);
  currentColorWheelValue = lastColorWheelValue;
  delay(100);

  
}

void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // When you connect to wifi turn on light
  digitalWrite(connectionLED, HIGH);
}
