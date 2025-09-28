let BLUE = 0;
let GREEN = 1;
let RED = 2;
let YELLOW = 3;
let ZERO_COUNT = 1;
let ONE_THROUGH_NINE_COUNT = 2;
let STARTING_HAND_SIZE = 7;
let DECK_SIZE = 100;  //  standard -8 because no wilds
var used_cards = 0;
var deck = [];
let bot;
let player;
var discard_pile;
var last_number_card;
var discard_pile_html_image = document.querySelector("#discard_pile");
var show_bot_hand = document.querySelector("#hand_bot");
var show_player_hand = document.querySelector("#player_hand");
class Card {
  constructor(filePath, count, type, color, numeric_value) {
    this.filePath = filePath;
    this.count = count;
    this.type = type;
    this.color = color;
    this.numeric_value = numeric_value;
  }
}

class Hand {
  constructor(cards) {
    this.cards = this.sort_cards(cards);
    this.card_count = STARTING_HAND_SIZE;
  }
  sort_cards(cards) {
    var categorize = [
      [[], []],  // BLUE: [numbers, actions]
      [[], []],  // GREEN: [numbers, actions] 
      [[], []],  // RED: [numbers, actions]
      [[], []]   // YELLOW: [numbers, actions]
    ];
    for (var i = 0; i < cards.length; ++i) {
      var cur_card = cards[i];
      var index = get_place_index(cur_card);
      if (cur_card.type == "number") {
        categorize[index][0].push(cur_card);  // number card
      } else {
        categorize[index][1].push(cur_card);  // action card
      }
    }
    return categorize;
  }
  sort_single_card(card) {
    var index = get_place_index(card);
    if (card.type == "number") {
      this.cards[index][0].push(card);  // number card
    } else {
      this.cards[index][1].push(card);  // action card
    }
    if (this === bot.hand) {
      add_bot_card();
    } else {
      add_player_card();
    }
  }
  remove_card(card) {
    --this.card_count;
    var card_color_index = get_place_index(card);
    var number_or_action;
    if (card.type == "number") {
      number_or_action = 0;
    } else {
      number_or_action = 1;
    }
    var target_array = this.cards[card_color_index][number_or_action];
    var card_index = target_array.indexOf(card);
    if (card_index !== -1) {
      target_array.splice(card_index, 1);
      console.log("card removed from hand");
     if (this === bot.hand) {
        remove_bot_card();
      } else {
        remove_player_card();
      }
      return true;
    }
    console.log("card not found in hand");
    return false;
  }
}

class Player {
  constructor(hand) {
    this.hand = hand;
  }
}


function init_deck() {
  used_cards = 0;
  deck = [
    // BLUE (index 0)
    [
      new Card("../img/blue/0_blue.png", ZERO_COUNT, "number", "blue", 0),
      new Card("../img/blue/1_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 1),
      new Card("../img/blue/2_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 2),
      new Card("../img/blue/3_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 3),
      new Card("../img/blue/4_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 4),
      new Card("../img/blue/5_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 5),
      new Card("../img/blue/6_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 6),
      new Card("../img/blue/7_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 7),
      new Card("../img/blue/8_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 8),
      new Card("../img/blue/9_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 9),
      new Card("../img/blue/2plus_blue.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "blue", -1),
      new Card("../img/blue/block_blue.png", ONE_THROUGH_NINE_COUNT, "action_block", "blue", -2),
      new Card("../img/blue/inverse_blue.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "blue", -3)
    ],
    // GREEN (index 1)
    [
      new Card("../img/green/0_green.png", ZERO_COUNT, "number", "green", 0),
      new Card("../img/green/1_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 1),
      new Card("../img/green/2_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 2),
      new Card("../img/green/3_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 3),
      new Card("../img/green/4_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 4),
      new Card("../img/green/5_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 5),
      new Card("../img/green/6_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 6),
      new Card("../img/green/7_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 7),
      new Card("../img/green/8_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 8),
      new Card("../img/green/9_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 9),
      new Card("../img/green/2plus_green.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "green", -1),
      new Card("../img/green/block_green.png", ONE_THROUGH_NINE_COUNT, "action_block", "green", -2),
      new Card("../img/green/inverse_green.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "green", -3)
    ],
    // RED (index 2)
    [
      new Card("../img/red/0_red.png", ZERO_COUNT, "number", "red", 0),
      new Card("../img/red/1_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 1),
      new Card("../img/red/2_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 2),
      new Card("../img/red/3_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 3),
      new Card("../img/red/4_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 4),
      new Card("../img/red/5_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 5),
      new Card("../img/red/6_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 6),
      new Card("../img/red/7_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 7),
      new Card("../img/red/8_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 8),
      new Card("../img/red/9_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 9),
      new Card("../img/red/2plus_red.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "red", -1),
      new Card("../img/red/block_red.png", ONE_THROUGH_NINE_COUNT, "action_block", "red", -2),
      new Card("../img/red/inverse_red.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "red", -3)
    ],
    // YELLOW (index 4)
    [
      new Card("../img/yellow/0_yellow.png", ZERO_COUNT, "number", "yellow", 0),
      new Card("../img/yellow/1_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 1),
      new Card("../img/yellow/2_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 2),
      new Card("../img/yellow/3_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 3),
      new Card("../img/yellow/4_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 4),
      new Card("../img/yellow/5_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 5),
      new Card("../img/yellow/6_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 6),
      new Card("../img/yellow/7_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 7),
      new Card("../img/yellow/8_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 8),
      new Card("../img/yellow/9_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 9),
      new Card("../img/yellow/2plus_yellow.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "yellow", -1),
      new Card("../img/yellow/block_yellow.png", ONE_THROUGH_NINE_COUNT, "action_block", "yellow", -2),
      new Card("../img/yellow/inverse_yellow.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "yellow", -3)
    ]
  ];
}

function deal_starting_card() { //  make sure first card is a numeber card
  var random_inner;
  var random_inner_index;
  var card;
  var found = false;
  while(!found) {
    random_inner = Math.floor(Math.random() * deck.length);
    random_inner_index = Math.floor(Math.random() * deck[random_inner].length);
    var card = deck[random_inner][random_inner_index];
    if ((card.count > 0) && (card.type === "number")) {
      --deck[random_inner][random_inner_index].count;
      ++used_cards;
      found = true;
      if (used_cards == DECK_SIZE) {
        init_deck();
      }
    }
  }
  last_number_card = card;
  return card;
}

function deal_card() {
  var random_inner;
  var random_inner_index;
  var card;
  var found = false;
  while(!found) {
    random_inner = Math.floor(Math.random() * deck.length);
    random_inner_index = Math.floor(Math.random() * deck[random_inner].length);
    if (deck[random_inner][random_inner_index].count > 0) {
      card = deck[random_inner][random_inner_index];
      --deck[random_inner][random_inner_index].count;
      ++used_cards;
      found = true;
      if (used_cards == DECK_SIZE) {
        init_deck();
      }
    }
  }
  return card;
}

function deal_hand() {
  var hand = [];
  while(hand.length != STARTING_HAND_SIZE) {
    hand.push(deal_card());
  }
  console.log(hand);
  return hand;
}

function goes_first() {
  coin_flip = Math.floor(Math.random() * 10); //  [0, 9]
  if (coin_flip <= 4) { //  4 is half way point: 0, 1, 2, 3, .. 9
    return true;  //  player goes first
  }
  return false; //  bot goes first
}

function get_place_index(card) {
  var index;
  if (card.color == "blue") {
    index = BLUE;
  } else if (card.color == "green") {
    index = GREEN;
  } else if (card.color == "red") {
    index = RED;
  } else {
    index = YELLOW;
  }
  return index;
}

function mask_discard_pile() {
  // mask the discard pile when action card is place to prevent infinate loop
  discard_pile = new Card(discard_pile.filePath, discard_pile.count, "number", discard_pile.color, discard_pile.numeric_value);
}

function place_card_bot() {
  var loc_of_pile_index = get_place_index(discard_pile);  //  BLUE, GREEN, RED, YELLOW
  var same_color_number = [];
  var diff_color_same_number = [];
  var same_color_action = [];
  var diff_color_same_action = [];
  var all_available = [
    {name: "same_color_number", cards: same_color_number},
    {name: "diff_color_same_number", cards: diff_color_same_number}, 
    {name: "same_color_action", cards: same_color_action},
    {name: "diff_color_same_action", cards: diff_color_same_action}
  ];
  //  same color cards
  var curl_loc = bot.hand.cards[loc_of_pile_index];
  for (var i = 0; i < curl_loc.length; ++i) {
    var cur_section = curl_loc[i];  //  0 number 1 action
    for (var j = 0; j < cur_section.length; ++j) {
      var cur_card = cur_section[j];
      if (i == 0) {
        same_color_number.push(cur_card);  //  same color number card/s
      } else {
        same_color_action.push(cur_card);  //  same color action card/s
      }
    }
  }
   //  checking for same number or same action in a different color
  for (var i = 0; i < bot.hand.cards.length; ++i) {
    if ((i == loc_of_pile_index)) {  //  skip same color
      // ++i;
      continue;
    }
    var cur_color = bot.hand.cards[i];
    for (var j = 0; j < cur_color.length; ++j) {
      var cur_selection = cur_color[j];
      for (var k = 0; k < cur_selection.length; ++k) {
        var cur_card = cur_selection[k];
        if ((cur_card.type == "number") && (cur_card.numeric_value == discard_pile.numeric_value)) {
          diff_color_same_number.push(cur_card);
        } else if ((cur_card.type != "number") && (cur_card.numeric_value == discard_pile.numeric_value)) {
          diff_color_same_action.push(cur_card);
        }
      }
    }
  }
  var filtered_available = [];
  for (var i = 0; i < all_available.length; ++i) {  //  preproccessing: remove empty
    if (all_available[i].cards.length > 0) {
      filtered_available.push(all_available[i]);
    }
  }
  if (filtered_available.length === 0) {  //  can't place
    console.log("can't place nothing available");
    return false;
  }
  //  finaly select card to place
  var selected_category_index;
  var selected_card;
  do {
    selected_category_index = Math.floor(Math.random() * filtered_available.length);
  } while (filtered_available[selected_category_index].cards.length == 0);
  
  var selected_category = filtered_available[selected_category_index];  // get the selected category
  console.log(`Selected category: ${selected_category.name}`);
  
  if (selected_category.cards.length == 1) { // if only one card use it otherwise pick randomly
    selected_card = selected_category.cards[0];
    console.log("Only one card available, selecting it");
  } else {
    var card_index = Math.floor(Math.random() * selected_category.cards.length);
    selected_card = selected_category.cards[card_index];
    console.log(`Multiple cards available, randomly selected index ${card_index}`);
  }
  console.log("Selected card:", selected_card);
  discard_pile = selected_card;   //  card has been placed
  discard_pile_html_image.src = selected_card.filePath; //  update image
  bot.hand.remove_card(selected_card);  //  now remove card from hand
  return true;
}

function place_specific_card_bot(card) {
  var index_card = get_place_index(card);  //  color location of card
  var index_discard_pile = get_place_index(discard_pile);  //  color location of discard pile
  if ((index_card == index_discard_pile) || (card.numeric_value == discard_pile.numeric_value)) { //  same color or numeric value
    discard_pile = card;
    discard_pile_html_image.src = card.filePath;
    bot.hand.remove_card(card);
    return true;
  } else {
    return false; //  cant be placed
  }
}

function handle_action_card_effects_bot() {
  if (discard_pile.type != "number") {  //  handle action card effects
    if (discard_pile.type == "action_plus2") { //  plus two
      console.log("draws 2 cards due to +2!");
      bot.hand.sort_single_card(deal_card());
      bot.hand.sort_single_card(deal_card());
      bot.hand.card_count += 2;
      mask_discard_pile();
      return true;  //  skip turn after drawing
    } else { //  block or inverse
      console.log(`is skipped due to ${discard_pile.type}!`);
      mask_discard_pile();
      return true;  //  skip turn
    }
  }
  return false;  //  no action card, continue normal turn
}

function turn_player() {
  //  player choses what to do during their turn
}

function turn_bot() { //  scripted turn
  if (!place_card_bot()) {  //  if no card can be placed
    var card = deal_card(); //  get a card
    bot.hand.sort_single_card(card);
    ++bot.hand.card_count;
    place_specific_card_bot(card);  //  place new card if possible otherwise end turn
  }
}

function display_bot_hand() {
  for (var i = 0; i < bot.hand.card_count; i++) {
    var cardImg = document.createElement("img");
    cardImg.src = "../img/card\ back/card_back.png";
    cardImg.alt = "bot card";
    show_bot_hand.appendChild(cardImg);
  }
}

function display_player_hand() {
  for (var i = 0; i < player.hand.cards.length; i++) {
    for (var j = 0; j < player.hand.cards[i].length; j++) {
      for (var k = 0; k < player.hand.cards[i][j].length; k++) {
        var card = player.hand.cards[i][j][k];
        var cardImg = document.createElement("img");
        cardImg.src = card.filePath;
        cardImg.alt = "player card";
        show_player_hand.appendChild(cardImg);
      }
    }
  }
}

function add_bot_card() {
  var cardImg = document.createElement("img");
  cardImg.src = "../img/card\ back/card_back.png";
  cardImg.alt = "bot card";
  show_bot_hand.appendChild(cardImg);
}

function remove_bot_card() {
  show_bot_hand.removeChild(show_bot_hand.lastElementChild);
}

function remove_player_card() {
  //  TODO
}

function add_player_card() {
  //  TODO
}

function init_game() {
  init_deck();
  hand_bot = new Hand(deal_hand());
  hand_player = new Hand(deal_hand());
  bot = new Player(hand_bot);
  player = new Player(hand_player);
  discard_pile = deal_starting_card();
  discard_pile_html_image.src = discard_pile.filePath;
  bot.hand.sort_single_card(deal_card());
  bot.hand.sort_single_card(deal_card());
  bot.hand.sort_single_card(deal_card());
  console.log(bot.hand.cards);
  display_bot_hand();
  display_player_hand();
  // var who = goes_first();
  // while ((player.hand.cards.length > 0) && (bot.hand.cards.length > 0)) {
  //   if (who) {  //  player goes first
  //     turn_player();
  //     turn_bot();
  //   }
  //   turn_bot();
  //   turn_player();
  // }
}

init_game();

// function test_two_bots() {
//   console.log("=== STARTING TWO BOT SIMULATION ===");
  
//   init_deck();
  
//   // Create two bots
//   var hand_bot1 = new Hand(deal_hand());
//   var hand_bot2 = new Hand(deal_hand());
//   var bot1 = new Player(hand_bot1);
//   var bot2 = new Player(hand_bot2);
  
//   discard_pile = deal_starting_card().filePath;
  
//   console.log(`Starting discard pile: ${discard_pile.color} ${discard_pile.numeric_value} (${discard_pile.type})`);
//   console.log(`Bot1 starting hand count: ${bot1.hand.card_count}`);
//   console.log(`Bot2 starting hand count: ${bot2.hand.card_count}`);
  
//   var turn_count = 0;
//   var current_player = 1; // 1 for bot1, 2 for bot2
  
//   while (bot1.hand.card_count > 0 && bot2.hand.card_count > 0) {
//     turn_count++;
//     var active_bot = (current_player === 1) ? bot1 : bot2;
//     var bot_name = `Bot${current_player}`;
    
//     console.log(`\n--- TURN ${turn_count} (${bot_name}) ---`);
//     console.log(`Current discard pile: ${discard_pile.color} ${discard_pile.numeric_value} (${discard_pile.type})`);
//     console.log(`${bot_name} hand count before turn: ${active_bot.hand.card_count}`);
    
//     // Show current bot's hand by color count
//     show_bot_hand_counts(active_bot, bot_name);
    
//     // Check if current player is affected by action card
//     if (handle_action_card_effects(active_bot, bot_name)) {
//       // Action card effect applied, skip normal turn
//     } else {
//       // Normal turn - no action card affecting this player
//       var original_bot = bot;
//       bot = active_bot;
      
//       var could_place = place_card_bot();
      
//       if (!could_place) {
//         console.log(`${bot_name} couldn't place a card, drawing...`);
//         var drawn_card = deal_card();
//         console.log(`${bot_name} drew: ${drawn_card.color} ${drawn_card.numeric_value} (${drawn_card.type})`);
//         active_bot.hand.sort_single_card(drawn_card);
//         ++active_bot.hand.card_count;
//         console.log(`${bot_name} trying to place drawn card...`);
        
//         var placed_drawn = place_specific_card_bot(drawn_card);
//         if (placed_drawn) {
//           console.log(`${bot_name} successfully placed drawn card!`);
//         } else {
//           console.log(`${bot_name} couldn't place drawn card, turn ends`);
//         }
//       }
      
//       bot = original_bot;
//     }
    
//     console.log(`${bot_name} hand count after turn: ${active_bot.hand.card_count}`);
//     console.log(`New discard pile: ${discard_pile.color} ${discard_pile.numeric_value} (${discard_pile.type})`);
//     console.log(`Bot1: ${bot1.hand.card_count} cards | Bot2: ${bot2.hand.card_count} cards`);
    
//     // Switch players
//     current_player = (current_player === 1) ? 2 : 1;
    
//     // Safety check to prevent infinite loops
//     if (turn_count > 200) {
//       console.log("SAFETY BREAK: Too many turns, ending test");
//       break;
//     }
//   }
  
//   if (bot1.hand.card_count === 0) {
//     console.log(`\n🎉 BOT1 WINS! Completed in ${turn_count} turns!`);
//     console.log(`Final scores - Bot1: 0 cards, Bot2: ${bot2.hand.card_count} cards`);
//   } else if (bot2.hand.card_count === 0) {
//     console.log(`\n🎉 BOT2 WINS! Completed in ${turn_count} turns!`);
//     console.log(`Final scores - Bot1: ${bot1.hand.card_count} cards, Bot2: 0 cards`);
//   } else {
//     console.log(`\n⚠️ Game ended early at turn ${turn_count}`);
//     console.log(`Final scores - Bot1: ${bot1.hand.card_count} cards, Bot2: ${bot2.hand.card_count} cards`);
//   }
  
//   console.log("=== SIMULATION COMPLETE ===");
// }

// function show_bot_hand_counts(bot, bot_name) {
//   var colors = ["Blue", "Green", "Red", "Yellow"];
//   var color_counts = [];
  
//   for (var color = 0; color < bot.hand.cards.length; color++) {
//     var numbers_count = bot.hand.cards[color][0].length;  // number cards
//     var actions_count = bot.hand.cards[color][1].length;  // action cards
//     var total_count = numbers_count + actions_count;
    
//     if (total_count > 0) {
//       color_counts.push(`${colors[color]}: ${total_count}`);
//     }
//   }
  
//   if (color_counts.length > 0) {
//     console.log(`${bot_name} cards by color: ${color_counts.join(", ")}`);
//   } else {
//     console.log(`${bot_name} has no cards!`);
//   }
// }

// test_two_bots();