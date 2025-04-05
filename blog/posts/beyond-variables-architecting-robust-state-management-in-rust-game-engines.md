---
layout: post.njk
title: Beyond Variables - Crafting Robust State Management in Rust Game Engines
date: 2025-03-28
description: Discover how immutable state patterns in Rust create robust, time-travel capable game engines that work seamlessly across platforms.
permalink: /blog/posts/{{ title | slug }}/index.html
featured_image: https://res.cloudinary.com/slothcrew/image/upload/v1524112915/portfoliopics/nightrunner-lib.png
tags: 
    - rust
    - game development
    - state management
    - software architecture
    - webassembly
    - crossplatform
    - text adventure
    - game engine
    - software engineering
---

# Beyond Variables: Crafting Robust State Management in Rust Game Engines

Managing state is one of the trickiest parts of software engineering, especially in interactive applications where user actions constantly change the state. Text adventure games, like those built with the [Nightrunner engine](https://www.github.com/aimerib/nightrunner-lib), face unique challenges: they need to track player inventory, room configurations, completed events, active quests, and more—all while supporting features like save/load and undo/redo.

In this post, we'll dive into how the Nightrunner library tackles these complexities with a robust state management architecture. We'll explore immutable state transitions, history tracking, and cross-platform considerations.

## The Anatomy of Game State

Let's start by looking at how Nightrunner models its game state. Instead of using a bunch of separate variables, the engine organizes all state information into a cohesive structure:

```rust
pub struct State {
    /// Current value of the input box
    pub input: String,
    /// Player's current location
    pub current_room: u16,
    /// Player's current state
    pub player: Player,
    /// While the config struct provides the available rooms,
    /// the state struct contains the room structs fully populated.
    /// This helps us keep track of updates to the room structs
    /// while keeping the config struct clean.
    pub rooms: Vec<Room>,
    /// This Config struct holds all the game data
    /// such as verbs, items, etc.
    pub config: Config,
}
```

This structured approach has several benefits:

1. **Clear Boundaries**: The state encapsulates everything needed to render the current game situation.
2. **Single Source of Truth**: All components access the same state structure, avoiding synchronization issues.
3. **State Snapshots**: The entire game state can be captured at any point for history tracking.

Notice how the `State` struct separates static configuration (in the `config` field) from dynamic state (rooms, player status). This separation is crucial—configuration data represents the "rules" of the game world, while the dynamic state reflects the current game situation as affected by player actions.

The `Player` struct further encapsulates player-specific state:

```rust
pub struct Player {
    /// The player's inventory
    pub inventory: Storage,
}
```

And each `Room` maintains its own state through a collection of items, subjects, and events:

```rust
pub struct Room {
    pub id: u16,
    pub name: String,
    pub description: String,
    pub exits: Vec<Exits>,
    pub stash: Storage,
    pub events: Vec<Event>,
    pub narrative: u16,
    pub subjects: Vec<Subject>,
}
```

This hierarchical structure makes the state both comprehensive and modular, allowing different components to focus on their relevant parts of the state.

## Immutability as a Design Principle

One of the most powerful patterns in Nightrunner's state management is the use of immutability. Instead of modifying state in place, operations that transform state follow a pattern of:

1. Clone the current state
2. Modify the cloned state
3. Return the new state along with the operation result

This pattern is evident in functions like `player_get_item`:

```rust
pub fn player_get_item(state: &State, item: Item) -> NRResult<(State, ParsingResult)> {
    let mut new_state = state.clone();
    let current_room_id = new_state.current_room;
    let current_room = new_state
        .rooms
        .iter_mut()
        .find(|room| room.id == current_room_id)
        .unwrap();

    match current_room.stash.remove_item(item) {
        Ok(item) => {
            new_state.player.inventory.add_item(item.clone());
            let message = format!("\nYou now have a {}\n", item.name);
            Ok((new_state, ParsingResult::NewItem(message)))
        }
        Err(_) => Err(NoItem.into()),
    }
}
```

The benefits of this approach include:

1. **Thread Safety**: Immutable state transitions eliminate concurrency issues.
2. **Debugging**: Each state change is explicit and can be tracked.
3. **Time Travel**: Previous states can be stored for undo functionality.
4. **Testing**: State transitions can be tested in isolation.

This pattern isn't without costs—cloning entire state trees can be expensive. However, for the scale of a text adventure game, the clarity and robustness advantages outweigh performance concerns.

## State History Management

Nightrunner implements an elegant undo/redo system by maintaining stacks of previous and future states:

```rust
pub struct NightRunner {
    state: State,
    previous_states: Vec<State>,
    future_states: Vec<State>,
}
```

When a state change occurs, the previous state is pushed onto the `previous_states` stack:

```rust
pub fn parse_input(&mut self, input: &str) -> NRResult<ParsingResult> {
    let (new_state, parsing_result) = parser::parse(&self.state, input)?;
    self.previous_states.push(self.state.clone());
    self.state = new_state;
    Ok(parsing_result)
}
```

The `rewind_state` function then implements undo by popping from `previous_states`:

```rust
pub fn rewind_state(&mut self) -> NRResult<ParsingResult> {
    if let Some(state) = self.previous_states.pop() {
        self.future_states.push(self.state.clone());
        self.state = state;
        Ok(ParsingResult::Look("Rewound to previous state".to_string()))
    } else {
        Err("No previous state to rewind to".into())
    }
}
```

And `fast_forward_state` implements redo by popping from `future_states`:

```rust
pub fn fast_forward_state(&mut self) -> NRResult<ParsingResult> {
    if let Some(state) = self.future_states.pop() {
        self.previous_states.push(self.state.clone());
        self.state = state;
        Ok(ParsingResult::Look(
            "Fast forwarded to next state".to_string(),
        ))
    } else {
        Err("No future state to fast forward to".into())
    }
}
```

This bidirectional time travel mechanism provides a powerful tool for players to experiment with different choices without fear of making irreversible mistakes.

## Cross-Platform State Considerations

Nightrunner faces an additional challenge: it targets both native applications and the web via WebAssembly. This cross-platform approach requires careful handling of state serialization and API design.

For the web target, Nightrunner provides a simplified API that uses JSON for state transitions:

```rust
#[wasm_bindgen]
pub fn parse(&mut self, input: &str) -> Result<JsValue, JsError> {
    let result = parser::parse(&self.state, input);
    match result {
        Ok((new_state, ok)) => {
            self.previous_states.push(self.state.clone());
            self.state = new_state;
            // Convert to JavaScript-compatible format
            Ok(serde_wasm_bindgen::to_value(&ok)?)
        }
        Err(err) => Err(JsError::new(&err.to_string())),
    }
}
```

The engine uses conditional compilation to provide different implementations for each platform:

```rust
#[cfg(not(target_arch = "wasm32"))]
/// Rust-native implementation
impl NightRunner {
    // Rust-specific methods
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
/// WebAssembly implementation
impl NightRunner {
    // WASM-specific methods
}
```

This approach maintains a consistent state model while adapting the API surface to the capabilities and constraints of each platform.

## Conclusion

Nightrunner's state management architecture demonstrates several key principles applicable to many software domains:

1. **Structured State**: Encapsulate all state in well-defined structures.
2. **Immutable Transitions**: Favor creating new state rather than mutating existing state.
3. **History Tracking**: Use state snapshots to implement time travel features.
4. **Platform Adaptation**: Maintain a consistent state model across platforms while adapting APIs.

These principles create a robust foundation that can support increasingly complex features while maintaining code clarity and testability. Whether you're building a game engine, a web application, or any stateful system, these architectural patterns can help you manage complexity and build more maintainable software.

In our next post, we'll explore how Nightrunner implements its parser architecture to transform arbitrary text commands into meaningful game actions.