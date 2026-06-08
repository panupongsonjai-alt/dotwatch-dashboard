#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include "config.h"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSend = 0;
const unsigned long sendInterval = 5000;

void connectWiFi()
{
    Serial.println();
    Serial.print("Connecting WiFi");

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected");
    Serial.print("IP : ");
    Serial.println(WiFi.localIP());
}

void setupFirebase()
{
    config.database_url = FIREBASE_HOST;
    config.signer.tokens.legacy_token = FIREBASE_AUTH;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    Serial.println("Firebase Connected");
}

void setup()
{
    Serial.begin(115200);
    delay(1000);

    dht.begin();
    delay(2000);

    connectWiFi();
    setupFirebase();
}

void loop()
{
    if (millis() - lastSend >= sendInterval)
    {
        lastSend = millis();

        if (!Firebase.ready())
        {
            Serial.println("Firebase Not Ready");
            return;
        }

        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();

        if (isnan(temperature) || isnan(humidity))
        {
            Serial.println("DHT Read Failed");
            Serial.println("Check DHTPIN, DHTTYPE, wiring, and pull-up resistor");
            return;
        }

        Serial.println("----------------");
        Serial.print("Temperature : ");
        Serial.println(temperature);

        Serial.print("Humidity : ");
        Serial.println(humidity);

        bool tempOK = Firebase.RTDB.setFloat(&fbdo, "/sensor/temperature", temperature);
        bool humOK = Firebase.RTDB.setFloat(&fbdo, "/sensor/humidity", humidity);
        bool statusOK = Firebase.RTDB.setString(&fbdo, "/sensor/status", "online");

        if (tempOK && humOK && statusOK)
        {
            Serial.println("Firebase Update Success");
        }
        else
        {
            Serial.print("Firebase Error : ");
            Serial.println(fbdo.errorReason());
        }
    }
}