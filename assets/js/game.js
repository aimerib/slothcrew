import { NightRunner } from "@nightrunner/nightrunner_lib";
import gameData from "./game-data.json";

class TextAdventureGame {
  constructor(outputElement, inputElement) {
    this.outputElement = outputElement;
    this.inputElement = inputElement;
    this.history = [];
    this.engine = null;
    this.isInitialized = false;
    
    this.highlightableWords = [
      "rust", "webassembly", "wasm", "ruby", "rails", "react", 
      "javascript", "typescript", "golang", "elixir", "phoenix",
      "nightrunner", "devops", "docker", "aws", "ci/cd"
    ];
  }
  
  async initialize() {
    try {
      this.displayMessage("Initializing game engine...", "system");
      
      this.engine = new NightRunner(JSON.stringify(gameData));
      
      const introText = this.engine.game_intro();
      this.displayMessage(introText, "intro");
      
      const firstRoomResult = this.engine.first_room_text();
      const firstRoomData = JSON.parse(JSON.stringify(firstRoomResult));
      
      this.displayMessage(firstRoomData.message, "look");
      
      this.isInitialized = true;
      this.inputElement.focus();
      
      return true;
    } catch (error) {
      console.error("Failed to initialize game engine:", error);
      this.displayError("Failed to initialize the text adventure engine. Please check the console for details.");
      return false;
    }
  }
  
  processCommand(command) {
    if (!this.isInitialized) {
      this.displayError("Game engine is not yet initialized. Please wait...");
      return;
    }
    
    try {
      command = command.toLowerCase();
      this.displayMessage(`> ${command}`, "command");
      
      this.history.push(command);
      
      const result = this.engine.parse(command);
      
      const parsedResult = JSON.parse(JSON.stringify(result));
      
      this.displayResult(parsedResult);
      
      this.inputElement.value = "";
      this.inputElement.focus();
    } catch (error) {
      this.displayError(error.message);
    }
  }
  
  displayResult(result) {
    const { messageType, data } = result;
    
    switch (messageType) {
      case "look":
        this.displayMessage(data, "look");
        break;
      case "inventory":
        this.displayMessage(data, "inventory");
        break;
      case "help":
        this.displayMessage(data, "help");
        break;
      case "new_item":
        this.displayMessage(data, "item");
        break;
      case "drop_item":
        this.displayMessage(data, "item");
        break;
      case "event_success":
        this.displayMessage(data.message, "event");
        break;
      case "subject_no_event":
        this.displayMessage(data, "talk");
        break;
      case "quit":
        this.displayMessage("Thanks for playing! Refresh the page to start again.", "system");
        break;
      default:
        this.displayMessage(data, "default");
    }
  }
  
  displayMessage(message, type = "") {
    const messageElement = document.createElement("div");
    messageElement.className = `game-message ${type}`;
    
    const processedMessage = this.processMessageForHighlighting(message);
    messageElement.innerHTML = processedMessage;
    
    this.outputElement.appendChild(messageElement);
    
    this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight;
  }
  
  displayError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "game-message error";
    errorElement.textContent = message;
    
    this.outputElement.appendChild(errorElement);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }
  
  processMessageForHighlighting(message) {
    let processedMessage = message;
    
    this.highlightableWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedMessage = processedMessage.replace(regex, match => `<span class="highlight">${match}</span>`);
    });
    
    processedMessage = processedMessage.replace(/\n/g, '<br>');
    
    return processedMessage;
  }
  
  resetGame() {
    while (this.outputElement.firstChild) {
      this.outputElement.removeChild(this.outputElement.firstChild);
    }
    
    this.history = [];
    
    this.initialize();
  }
}


function initGame() {
  console.log("DOMContentLoaded")
  const outputElement = document.getElementById("game-output");
  const inputElement = document.getElementById("game-input");
  const gameForm = document.getElementById("game-form");
  const resetButton = document.getElementById("reset-game");
  
  const game = new TextAdventureGame(outputElement, inputElement);
  game.initialize().then(success => {
    if (success) {
      console.log("Game initialized successfully");
    }
  });
  
  gameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = inputElement.value.trim();
    if (command) {
      game.processCommand(command);
    }
  });
  
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      game.resetGame();
    });
  }
  
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      const prevCommand = game.history[game.history.length - 1];
      if (prevCommand) {
        inputElement.value = prevCommand;
        setTimeout(() => {
          inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
        }, 0);
      }
    }
  });
}

initGame()