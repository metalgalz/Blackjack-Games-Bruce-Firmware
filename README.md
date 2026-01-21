# **Embedded JS Blackjack ♠️**

A comprehensive implementation of the classic Blackjack (21) card game written in JavaScript. It simulates a casino table experience with AI bots and a dealer, designed specifically for embedded devices.

This game is designed for low-resolution screens and is **recommended for use with Lilygo T-Embed** devices running **Bruce Firmware**.

## **⚡ Quick Installation (Beginner's Guide)**

Follow these 3 simple steps to start playing immediately:

1. **Prepare the File**: Save the game code as blackjack.js on your computer.  
2. **Upload**:  
   * Connect your T-Embed to WiFi (or its Hotspot) to access the **Bruce Web Interface**.  
   * Go to **File Manager**.  
   * Open the /apps folder.  
   * Upload blackjack.js there.  
3. **Play**:  
   * On your T-Embed screen, open the main menu.  
   * Go to **Files** or **Launcher**.  
   * Select blackjack.js to start the game\!

## **🎮 Features**

* **4-Participant Simulation**: Play against the **Dealer** alongside **2 AI Bots**. Watch them hit or stand in real-time.  
* **Smart UI Layout**:  
  * **Green Table Area (80%)**: Displays cards for all players clearly.  
  * **Side Scoreboard (20%)**: Tracks names, round status (Win/Bust/Push), and total wins.  
* **Authentic Card Logic**:  
  * Full 52-card deck with shuffling.  
  * Correct value handling (Aces count as 1 or 11 automatically).  
  * Standard Dealer rules (Dealer must draw until 17).  
* **Visual Feedback**:  
  * Color-coded statuses: **Gold** (Win/Blackjack), **Red** (Bust/Lose), **White** (Standard).  
  * Hidden Dealer card revealed only at the end of the round.  
* **Responsive Controls**: Optimized for rotary inputs to easily toggle between "HIT" and "STAND".

## **🛠️ Hardware & Software Prerequisites**

This game was developed and tested in the following environment:

* **Device**: Lilygo T-Embed (Recommended)  
* **Firmware**: Bruce Firmware (supports standard display, keyboard modules)

### **Display & Input Specifications**

The interface is divided into a game table and a scoreboard sidebar. The code adapts to the screen dimensions (d.width() and d.height()) to ensure all cards fit on the screen.

## **🕹️ Controls (Lilygo T-Embed)**

| Button / Input | Menu / Turn Function | Result Screen |
| :---- | :---- | :---- |
| **Dial Left / Right** | Toggle **HIT** / **STAND** | \- |
| **Dial Press (Select)** | **Confirm Action** | **Next Round** |
| **Button / Esc** | Exit Game | Exit Game |

*\> Strategy Tip: Select "HIT" to take another card, or "STAND" to keep your current score. Don't go over 21\!*

## **📂 Code Structure**

* **Card Logic**:  
  * createDeck(): Generates and shuffles a fresh deck of 52 cards.  
  * calcScore(): Calculates hand values, automatically adjusting Aces to prevent busting.  
* **Entities**:  
  * Manages state for 4 entities: Dealer, Bot 1, Bot 2, and Player (You).  
* **Rendering**:  
  * drawUI(): Draws the table, sidebar, and status text.  
  * renderCard(): Draws individual card graphics (Suit and Rank).  
* **Game Loop**: A state machine handling the flow:  
  1. **Player Turn**: You decide to Hit/Stand.  
  2. **Bots Turn**: AI automatically plays.  
  3. **Dealer Turn**: Dealer plays by the rules.  
  4. **Result**: Winner determination and score updates.

## **📜 License**

This project is open-source. Feel free to use and modify it according to your needs.

*Made with ❤️ using JavaScript for the T-Embed Community.*