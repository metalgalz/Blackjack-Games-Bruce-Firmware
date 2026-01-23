var d = require('display');
var k = require('keyboard');

// ==========================================
// 1. CONFIGURATION & GLOBALS
// ==========================================

// Screen Size
var dw = d.width();
var dh = d.height();

// Layout (80% Game, 20% Scoreboard)
var gameW = Math.floor(dw * 0.8); 
var sideX = gameW;   
var sideW = dw - gameW;

// Colors
var C = d.color;
var cBgTable = C(34, 139, 34);   // Green Table
var cBgSide  = C(40, 40, 40);    // Dark Sidebar
var cWhite   = C(255, 255, 255);
var cBlack   = C(0, 0, 0);
var cRed     = C(220, 20, 60);   // Red Cards
var cGold    = C(255, 215, 0);   // Gold (Win)
var cGray    = C(100, 100, 100);
var cBlue    = C(50, 100, 255);  // Highlight

// Card Data
var suits = ["S", "H", "D", "C"]; 
var ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var values= [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

// Game State
var deck = [];
var players = []; 
var state = 0;    // 0:Init, 1:PlayerTurn, 2:BotsTurn, 3:DealerTurn, 4:Result
var pChoice = 0;  // 0: HIT, 1: STAND
var msg = "";     

var spr = d.createSprite();

// ==========================================
// 2. CARD LOGIC
// ==========================================

function createDeck() {
  deck = [];
  for(var s=0; s<4; s++) {
    for(var r=0; r<13; r++) {
      deck.push({s: s, r: r, v: values[r]});
    }
  }
  // Shuffle
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function drawCard() {
  if (deck.length === 0) createDeck();
  return deck.pop();
}

function calcScore(hand) {
  var score = 0;
  var aces = 0;
  for(var i=0; i<hand.length; i++) {
    score += hand[i].v;
    if(hand[i].r === 12) aces++; 
  }
  while(score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function resetGame() {
  createDeck();
  if(players.length === 0) {
      players = [
        {type:2, name:"DEALER", hand:[], score:0, st:"", wins:0}, 
        {type:0, name:"BOT 1",  hand:[], score:0, st:"", wins:0},  
        {type:0, name:"BOT 2",  hand:[], score:0, st:"", wins:0},  
        {type:1, name:"YOU",    hand:[], score:0, st:"", wins:0}   
      ];
  } else {
      for(var i=0; i<4; i++) {
          players[i].hand = [];
          players[i].score = 0;
          players[i].st = ""; 
      }
  }

  for(var j=0; j<2; j++) {
      for(var i=0; i<4; i++) players[i].hand.push(drawCard());
  }
  
  for(var i=0; i<4; i++) players[i].score = calcScore(players[i].hand);

  state = 1; 
  pChoice = 0;
  msg = "Your Turn";
}

// ==========================================
// 3. RENDERING
// ==========================================

function renderCard(x, y, card, isHidden) {
    var cw = 20; 
    var ch = 28;
    
    spr.drawRect(x+2, y+2, cw, ch, cBlack); 
    
    if (isHidden) {
        for(var i=0; i<ch; i++) spr.drawLine(x, y+i, x+cw, y+i, cRed);
        spr.drawRect(x, y, cw, ch, cWhite);
        return;
    }

    for(var i=0; i<ch; i++) spr.drawLine(x, y+i, x+cw, y+i, cWhite);
    spr.drawRect(x, y, cw, ch, cBlack);

    var col = (card.s === 1 || card.s === 2) ? cRed : cBlack;
    spr.setTextColor(col);
    spr.setTextSize(1);
    spr.setTextAlign(1); 
    spr.drawText(ranks[card.r], x + 10, y + 6);
    spr.drawText(suits[card.s], x + 10, y + 16);
}

function renderHand(x, y, pIdx, hideHole) {
    var hand = players[pIdx].hand;
    var offsetX = 12; 
    
    for (var i = 0; i < hand.length; i++) {
        var hidden = (hideHole && pIdx === 0 && i === 0); 
        renderCard(x + (i * offsetX), y, hand[i], hidden);
    }
}

function drawUI() {
    spr.fill(cBgTable); 

    // --- SEPARATOR ---
    spr.drawLine(sideX, 0, sideX, dh, cBlack);
    spr.drawLine(sideX+1, 0, sideX+1, dh, cBlack);

    // --- SCOREBOARD (RIGHT 20%) ---
    for(var i=0; i<dh; i++) spr.drawLine(sideX+2, i, dw, i, cBgSide);
    
    spr.setTextColor(cGold);
    spr.setTextAlign(1); 
    spr.drawText("PTS", sideX + (sideW/2), 10);
    spr.drawLine(sideX+5, 22, dw-5, 22, cWhite);

    spr.setTextAlign(0); // Left Align
    var listY = 35;
    for(var i=0; i<4; i++) {
        var p = players[i];
        var col = (i===3) ? cWhite : cGray; 
        if (p.st === "WIN" || p.st === "BJ") col = cGold;
        if (p.st === "BUST" || p.st === "LOSE") col = cRed;
        
        spr.setTextColor(col);
        spr.drawText(p.name, sideX + 4, listY);
        spr.setTextColor(cWhite);
        spr.drawText("W:" + p.wins, sideX + 4, listY + 10);
        
        if(p.st !== "") {
             spr.setTextColor((p.st==="WIN"||p.st==="BJ")?cGold:cRed);
             spr.drawText(p.st, sideX + 4, listY + 20);
        }
        
        listY += 33; 
    }

    // --- GAME AREA (LEFT 80%) ---
    
    // 1. DEALER
    var dx = (gameW / 2) - 20;
    var dy = 10;
    spr.setTextColor(cWhite); spr.setTextAlign(1);
    spr.drawText("DEALER (" + (state===4 ? players[0].score : "?") + ")", dx + 20, dy - 8);
    renderHand(dx, dy, 0, (state !== 4)); 

    // 2. BOT 1 (Left)
    var b1x = 10;
    var b1y = (dh / 2) - 20;
    spr.setTextColor(cWhite); spr.setTextAlign(0);
    spr.drawText("BOT 1", b1x, b1y - 10);
    renderHand(b1x, b1y, 1, false);
    if(players[1].score > 0) spr.drawText(players[1].score, b1x, b1y + 35);

    // 3. BOT 2 (Right - Geser Kanan)
    var b2x = gameW - 60; // Lebih ke kanan dari sebelumnya
    var b2y = (dh / 2) - 20;
    spr.setTextColor(cWhite); spr.setTextAlign(0);
    spr.drawText("BOT 2", b2x, b2y - 10);
    renderHand(b2x, b2y, 2, false);
    if(players[2].score > 0) spr.drawText(players[2].score, b2x, b2y + 35);

    // 4. PLAYER (Posisi diturunkan ke dh - 40 agar luas di tengah)
    var px = (gameW / 2) - 20;
    var py = dh - 40; 
    spr.setTextColor(cGold); spr.setTextAlign(1);
    spr.drawText("YOU (" + players[3].score + ")", px + 20, py - 10);
    renderHand(px, py, 3, false);

    // --- MENU (Posisi dinaikkan: py - 40) ---
    // Ini menggantung di tengah layar, jauh dari kartu player
    if (state === 1) {
        var menuY = py - 40; 
        
        var colHit = (pChoice === 0) ? cBlue : cBlack;
        var txtHit = (pChoice === 0) ? cWhite : cGray;
        for(var h=0; h<15; h++) spr.drawLine((gameW/2)-45, menuY+h, (gameW/2)-5, menuY+h, colHit);
        spr.setTextColor(txtHit); spr.drawText("HIT", (gameW/2)-25, menuY+3);

        var colStd = (pChoice === 1) ? cBlue : cBlack;
        var txtStd = (pChoice === 1) ? cWhite : cGray;
        for(var h=0; h<15; h++) spr.drawLine((gameW/2)+5, menuY+h, (gameW/2)+45, menuY+h, colStd);
        spr.setTextColor(txtStd); spr.drawText("STAND", (gameW/2)+25, menuY+3);
    }

    // --- STATUS MESSAGE (Dinaikkan lagi: py - 60) ---
    // Di atas tombol menu, dijamin tidak menutupi kartu atau angka player
    if (msg !== "") {
        spr.setTextColor(cWhite);
        spr.setTextAlign(1);
        spr.drawText(msg, gameW/2, py - 60); 
    }

    spr.pushSprite();
}

// ==========================================
// 4. GAME LOOP
// ==========================================

function botPlay(pIdx) {
    var limit = (pIdx === 0) ? 17 : 16;
    while (players[pIdx].score < limit) {
        players[pIdx].hand.push(drawCard());
        players[pIdx].score = calcScore(players[pIdx].hand);
    }
}

function checkWinner() {
    var dScore = players[0].score;
    if (dScore > 21) dScore = 0; 

    for (var i = 1; i < 4; i++) {
        var p = players[i];
        if (p.score > 21) {
            p.st = "BUST"; 
        } else {
            if (p.score > dScore) {
                p.st = "WIN";
                p.wins += 1; 
                if(p.score === 21 && p.hand.length === 2) {
                    p.st = "BJ"; 
                }
            } else if (p.score === dScore) {
                p.st = "PUSH";
            } else {
                p.st = "LOSE";
            }
        }
    }
}

function main() {
    resetGame();
    k.setLongPress(true);

    var lastSelTime = 0; 

    while(true) {
        var now = new Date().getTime();
        var sel = k.getSelPress(true); 
        var nxt = k.getNextPress(true); 
        var prv = k.getEscPress(true); 
        if (k.getNextPress(true) && k.getSelPress(true)) break;

        // Debounce Logic
        if (sel) {
            if (now - lastSelTime < 300) {
                sel = false;
            } else {
                lastSelTime = now;
            }
        }

        if (state === 1) { // PLAYER
            if (nxt || prv) {
                pChoice = (pChoice === 0) ? 1 : 0; 
            }
            if (sel) {
                if (pChoice === 0) { // HIT
                    players[3].hand.push(drawCard());
                    players[3].score = calcScore(players[3].hand);
                    if (players[3].score > 21) {
                        msg = "BUSTED!";
                        state = 2; // Next
                        delay(1000);
                    }
                } else { // STAND
                    state = 2; // Next
                }
            }
        } 
        else if (state === 2) { // BOTS
            msg = "Bot Playing...";
            drawUI(); delay(500);
            botPlay(1); drawUI(); delay(500); // Bot 1
            botPlay(2); drawUI(); delay(500); // Bot 2
            state = 3; 
        }
        else if (state === 3) { // DEALER
            msg = "Dealer Playing...";
            drawUI(); delay(800);
            botPlay(0); 
            state = 4; 
        }
        else if (state === 4) { // RESULT
            checkWinner();
            msg = "Round Over. OK -> Next";
            drawUI();
            
            delay(500);

            while(true) {
                if(k.getSelPress(true)) {
                    resetGame();
                    lastSelTime = new Date().getTime(); 
                    break;
                }
                delay(50);
            }
        }

        drawUI();
        delay(50);
    }
}

main();