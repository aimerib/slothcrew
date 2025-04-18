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
      this.showLoadingIndicator();
      await new Promise(resolve => setTimeout(resolve, 500));
      this.engine = new NightRunner(JSON.stringify(gameData));
      await this.typewriterEffect(this.engine.game_intro(), "intro");
      const firstRoomResult = this.engine.first_room_text();
      const firstRoomData = JSON.parse(JSON.stringify(firstRoomResult));
      await this.typewriterEffect(firstRoomData.message, "look");
      this.isInitialized = true;
      this.inputElement.focus();
      this.hideLoadingIndicator();
      return true;
    } catch (error) {
      console.error("Failed to initialize game engine:", error);
      this.hideLoadingIndicator();
      this.displayError("Game initialization failed. Please try refreshing the page.");
      return false;
    }
  }
  
  async processCommand(command) {
    if (!command.trim()) return;
    this.displayMessage(`> ${command}`, "command");
    this.history.push(command);
    this.historyIndex = this.history.length;
    try {
      const result = this.engine.parse(command);
      this.displayResult(result);
    } catch (error) {
      this.displayError(error.message);
    }
    this.inputElement.value = "";
    this.inputElement.focus();
  }
  
  displayResult(result) {
    const { messageType, data } = result;
    
    switch (messageType) {
      case "look":
        this.typewriterEffect(data, "look");
        break;
      case "inventory":
        this.typewriterEffect(data, "inventory");
        break;
      case "help":
        this.typewriterEffect(data, "help");
        break;
      case "new_item":
        this.typewriterEffect(data, "item");
        break;
      case "drop_item":
        this.typewriterEffect(data, "item");
        break;
      case "event_success":
        this.typewriterEffect(data.message, "event");
        break;
      case "subject_no_event":
        this.typewriterEffect(data, "talk");
        break;
      case "quit":
        this.typewriterEffect("Thanks for playing! Refresh the page to start again.", "system");
        break;
      default:
        this.typewriterEffect(data, "default");
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
    this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight * 2;
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
  
  async typewriterEffect(text, type) {
    const messageElement = document.createElement("div");
    messageElement.className = `game-message ${type}`;
    this.outputElement.appendChild(messageElement);
    let index = 0;
    return new Promise(resolve => {
      const interval = setInterval(() => {
        messageElement.textContent = text.slice(0, index);
        index++;
        this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight

        if (index > text.length) {
          clearInterval(interval);
          this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight
          resolve();
        }
      }, 5);
    });
  }
  
  showLoadingIndicator() {
    const loader = document.createElement("div");
    loader.className = "loading-spinner";
    this.outputElement.appendChild(loader);
  }
  
  hideLoadingIndicator() {
    const loader = this.outputElement.querySelector(".loading-spinner");
    if (loader) loader.remove();
  }
}


async function initGame() {
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
  
  gameForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const command = inputElement.value.trim();
    if (command) {
      await game.processCommand(command);
    }
  });
  
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      game.resetGame();
    });
  }
  
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (game.historyIndex > 0) {
        game.historyIndex--;
        inputElement.value = game.history[game.historyIndex] || "";
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (game.historyIndex < game.history.length - 1) {
        game.historyIndex++;
        inputElement.value = game.history[game.historyIndex] || "";
      }
    }
  });
  
  document.querySelectorAll(".game-command").forEach(cmd => {
    cmd.addEventListener("click", () => {
      const commandText = cmd.querySelector("strong").textContent;
      inputElement.value = commandText;
      inputElement.focus();
    });
  });
}

await initGame()