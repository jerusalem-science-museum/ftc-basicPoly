#include "Keyboard.h"

#define NUM_ACTIVE_PINS 7
#define pinA 2
#define pinB 3
#define pinC 4
#define pinD 5
#define pinE 6

#define pinUp 5
#define pinDown 6
#define pinRight 7
#define pinLeft 8
#define pinSlidePotA A0

// Rotary Encoder Inputs
#define CLK 10
#define DT 16
#define SW 14

int counter = 0;
int currentStateCLK;
int lastStateCLK;
String currentDir ="";
unsigned long lastButtonPress = 0;

void setup() {
// put your setup code here, to run once:
Serial.begin(9600);
Keyboard.begin();

// set buttons pins as inputs
pinMode(pinA, INPUT_PULLUP);
pinMode(pinB, INPUT_PULLUP);
pinMode(pinC, INPUT_PULLUP);
pinMode(pinD, INPUT_PULLUP);
pinMode(pinE, INPUT_PULLUP);
// pinMode(pinUp, INPUT_PULLUP);
// pinMode(pinDown, INPUT_PULLUP);
pinMode(pinRight, INPUT_PULLUP);
pinMode(pinLeft, INPUT_PULLUP);
pinMode(pinSlidePotA, INPUT);

// Set encoder pins as inputs
  pinMode(CLK,INPUT);
  pinMode(DT,INPUT);
  pinMode(SW, INPUT_PULLUP);

  // Setup Serial Monitor
  Serial.begin(9600);

  // Read the initial state of CLK
  lastStateCLK = digitalRead(CLK);


}


int buttonAPressed = 0;
int pinAValue = 0;

int buttonBPressed = 0;
int pinBValue = 0;

int buttonCPressed = 0;
int pinCValue = 0;

int buttonDPressed = 0;
int pinDValue = 0;

int buttonEPressed = 0;
int pinEValue = 0;


int buttonUpPressed = 0;
int pinUpValue = 0;

int buttonDownPressed = 0;
int pinDownValue = 0;

int buttonRightPressed = 0;
int pinRightValue = 0;

int buttonLeftPressed = 0;
int pinLeftValue = 0;


int prevSliderKey = 0;
int curSliderKey = 1;


void loop() {
// put your main code here, to run repeatedly:

//// slider reading
//int sliderValue = analogRead(pinSlidePotA);
//curSliderKey = map(sliderValue, 0, 1023, 1, 9);
//if (curSliderKey != prevSliderKey)
//{
//prevSliderKey = curSliderKey;
////Serial.println(prevSliderKey);
//Keyboard.press(48 + prevSliderKey);
//delay(50);
//Keyboard.release(48 + prevSliderKey);
//
//}
////Serial.print("Slider Pot Value: ");
////Serial.println(sliderValue);

// Read the current state of CLK
  currentStateCLK = digitalRead(CLK);

  // If last and current state of CLK are different, then pulse occurred
  // React to only 1 state change to avoid double count
  if (currentStateCLK != lastStateCLK  && currentStateCLK == 1){

    // If the DT state is different than the CLK state then
    // the encoder is rotating CCW so decrement
    if (digitalRead(DT) != currentStateCLK) {
      counter --;
      currentDir ="CCW";
      Keyboard.press(48 + 1);
      delay(50);
      Keyboard.release(48 + 1);
    } else {
      // Encoder is rotating CW so increment
      counter ++;
      currentDir ="CW";
      Keyboard.press(48 + 2);
      delay(50);
      Keyboard.release(48 + 2);
    }

    Serial.print("Direction: ");
    Serial.print(currentDir);
    Serial.print(" | Counter: ");
    Serial.println(counter);
  }

  // Remember last CLK state
  lastStateCLK = currentStateCLK;

  // Read the button state
  int btnState = digitalRead(SW);

  //If we detect LOW signal, button is pressed
  if (btnState == LOW) {
    //if 50ms have passed since last LOW pulse, it means that the
    //button has been pressed, released and pressed again
    if (millis() - lastButtonPress > 50) {
      Serial.println("Button pressed!");
    }

    // Remember last button press event
    lastButtonPress = millis();
  }

  // Put in a slight delay to help debounce the reading
  delay(1);





// read 'a' button:
pinAValue = digitalRead(pinA);
delay(10);

if (buttonAPressed != pinAValue)
{
buttonAPressed = pinAValue;
Serial.print("button A:");
Serial.println(pinAValue);
if (buttonAPressed)
{

Keyboard.press(97);
delay(50);
Keyboard.release(97);
}
}

// read 'b' button:
pinBValue = digitalRead(pinB);
delay(10);

if (buttonBPressed != pinBValue)
{
buttonBPressed = pinBValue;
Serial.print("button B:");
Serial.println(pinBValue);
if (buttonBPressed)
{
Keyboard.press(98);
delay(50);
Keyboard.release(98);
}
}

// read 'C' button:
pinCValue = digitalRead(pinC);
delay(10);

if (buttonCPressed != pinCValue)
{
buttonCPressed = pinCValue;
Serial.print("button C:");
Serial.println(pinCValue);
if (buttonCPressed)
{
Keyboard.press(99);
delay(50);
Keyboard.release(99);
}
}

// read 'd' button:
pinDValue = digitalRead(pinD);
delay(10);

if (buttonDPressed != pinDValue)
{
buttonDPressed = pinDValue;
Serial.print("button D:");
Serial.println(pinDValue);
if (buttonDPressed)
{
Keyboard.press(100);
delay(50);
Keyboard.release(100);
}
}


// read 'e' button:
pinEValue = digitalRead(pinE);
delay(10);

if (buttonEPressed != pinEValue)
{
buttonEPressed = pinEValue;
Serial.print("button E:");
Serial.println(pinEValue);
if (buttonDPressed)
{
Keyboard.press(101);
delay(50);
Keyboard.release(101);
}
}

// // read 'Up' button:
// pinUpValue = digitalRead(pinUp);
// delay(10);

// if (pinUpValue == 0)
// {
// Keyboard.press(KEY_UP_ARROW);
// }
// if (pinUpValue == 1)
// {
// Keyboard.release(KEY_UP_ARROW);
// }


// // read 'Down' button:
// pinDownValue = digitalRead(pinDown);
// delay(10);

// if (pinDownValue == 0)
// {
// Keyboard.press(KEY_DOWN_ARROW);
// }
// if (pinDownValue == 1)
// {
// Keyboard.release(KEY_DOWN_ARROW);
// }


// read 'Right' button:
pinRightValue = digitalRead(pinRight);
delay(10);
if (pinRightValue == 0)
{
Keyboard.press(KEY_RIGHT_ARROW);
}
if (pinRightValue == 1)
{
Keyboard.release(KEY_RIGHT_ARROW);
}


// read 'Left' button:
pinLeftValue = digitalRead(pinLeft);
delay(10);

if (pinLeftValue == 0)
{
Keyboard.press(KEY_LEFT_ARROW);
}
if (pinLeftValue == 1)
{
Keyboard.release(KEY_LEFT_ARROW);
}



if (false)
{
Keyboard.press(97);
delay(50);
Keyboard.release(97);
}

}
