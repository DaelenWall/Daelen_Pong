# 🏓 Daelen Pong - Browser Edition

A fun, fast-paced Pong game built with **p5.js** and vanilla JavaScript — hosted on GitHub Pages!

This version includes:
- Paddle-vs-paddle action (W/S vs ↑/↓)
- Win condition at 11 points
- "WINNER" display + game reset mechanic
- Increasing ball speed/paddle speed with every rally — both start slow after each point
- Fully playable in your browser!

## 🎮 How to Play

- **Left Paddle**:  
  - Move up: `W`  
  - Move down: `S`  

- **Right Paddle**:  
  - Move up: `↑`  
  - Move down: `↓`

- First player to **11 points** wins the round
- Ball speed increases by `+1` with each paddle hit
- After scoring a point, the ball launches slowly before ramping up again

## 🌐 Play It Live

**👉 [Click here to play](https://daelenwall.github.io/Daelen_Pong/)**  

## 🧠 How It Works

- Built with [p5.js](https://p5js.org/) for canvas rendering
- Everything lives in two files:
  - `index.html` – loads p5 and links to the game
  - `pong.js` – all the game logic, paddle AI, ball physics, and display code

## 🚀 Run Locally

Clone the repo:

```bash
git clone git@github.com:DaelenWall/Daelen_Pong.git
cd Daelen_Pong
