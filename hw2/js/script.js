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
var selected_card = null;
var selectedCardElement = null;
var player_has_placeable_cards = false;
var game_active = true;
var player_turn = true;
var discard_pile_html_image = document.querySelector("#discard_pile");
var show_bot_hand = document.querySelector("#hand_bot");
var show_player_hand = document.querySelector("#player_hand");
var place_button = document.querySelector("#place_button");
var draw_button = document.querySelector("#draw_button");
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

place_button.addEventListener("click", handle_place);
function handle_place() {
  if (!game_active || !player_turn) {
    return;
  }
  if (selected_card && player_can_place(selected_card)) {
    discard_pile = selected_card;
    discard_pile_html_image.src = selected_card.filePath;
    player.hand.remove_card(selected_card);
    if (selectedCardElement) {  // clear selection
      selectedCardElement.classList.remove("selected");
    }
    selected_card = null;
    selectedCardElement = null;
    display_player_hand();
    if (!game_active) {
      return;
    }
    player_turn = false;  //  switch turn to bot
    if (game_active) {
      turn_bot();
      player_turn = true; // Switch back to player
    }
  }
}

draw_button.addEventListener("click", handle_draw);
function handle_draw() {
  if (!game_active || !player_turn) {
    return;
  }
  if (!player_has_placeable_cards) {
    var card = deal_card();
    player.hand.sort_single_card(card);
    ++player.hand.card_count;
    display_player_hand();
    if (player_can_place(card)) {
      player_has_placeable_cards = true;
      console.log("Drawn card can be placed - waiting for player to place it");
    } else {
      console.log("Drawn card cannot be placed - turn should end");
      player_turn = false;  //  end player turn
      if (game_active) {
        turn_bot();
        player_turn = true;
      }
    }
  }
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
      display_bot_hand();
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

function handle_action_card_effects_player() {
  if (discard_pile.type != "number") {  //  handle action card effects
    if (discard_pile.type == "action_plus2") { //  plus two
      console.log("draws 2 cards due to +2!");
      player.hand.sort_single_card(deal_card());
      player.hand.sort_single_card(deal_card());
      player.hand.card_count += 2;
      display_player_hand();
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
  if (handle_action_card_effects_player()) {  //  if true skip turn
    return;
  } else {
    if (!player_has_placeable_cards) {
      var card = deal_card();
      player.hand.sort_single_card(card);
      ++player.hand.card_count;
      if (player_can_place(card)) {
        //  must place drawn card
      } else {
        return; //  cant place drawn card turn ends 
      }
      display_player_hand();
    }
  }
}

function turn_bot() { //  scripted turn
  if (!game_active || player_turn) { // sheck if game is active and it's bot's turn
    return;
  }
  if (handle_action_card_effects_bot()) {
    return;
  } else {
    if (!place_card_bot()) {
      var card = deal_card();
      bot.hand.sort_single_card(card);
      ++bot.hand.card_count;
      place_specific_card_bot(card);
    }
    display_bot_hand();
  }
}

function display_bot_hand() {
  show_bot_hand.innerHTML = "";
  if (bot.hand.card_count === 0) {  //  win logic
    end_game("bot");
    return;
  }
  for (var i = 0; i < bot.hand.card_count; i++) {
    var cardImg = document.createElement("img");
    cardImg.src = "../img/card\ back/card_back.png";
    cardImg.alt = "bot card";
    show_bot_hand.appendChild(cardImg);
  }
}

function player_can_place(card) {
  var card_color_index = get_place_index(card);
  var discard_color_index = get_place_index(discard_pile);
  // same color or same number/action value
  return (card_color_index === discard_color_index) || (card.numeric_value === discard_pile.numeric_value);
}

function handle_card_click(event) { //  on click
  var cardElement = event.target;
  var cardData = JSON.parse(cardElement.dataset.card);
  if (selectedCardElement) {  // remove previous selection
    selectedCardElement.classList.remove("selected");
  }
  cardElement.classList.add("selected");
  selected_card = cardData;
  selectedCardElement = cardElement;
  if (player_can_place(selected_card)) {
    place_button.classList.add("selected");
    draw_button.classList.remove("selected");
  } else if (player_has_placeable_cards) {
    place_button.classList.remove("selected");
    draw_button.classList.remove("selected");
  } else {
    place_button.classList.remove("selected");
    draw_button.classList.add("selected");
  }
}

function display_player_hand() {
  show_player_hand.innerHTML = "";
  var placable_count = 0;
  var total_cards = 0;  //  win logic
  for (var i = 0; i < player.hand.cards.length; i++) {
    for (var j = 0; j < player.hand.cards[i].length; j++) {
      total_cards += player.hand.cards[i][j].length;
    }
  }
  if (total_cards === 0) {
    end_game("player");
    return;
  }
  for (var i = 0; i < player.hand.cards.length; i++) {
    for (var j = 0; j < player.hand.cards[i].length; j++) {
      for (var k = 0; k < player.hand.cards[i][j].length; k++) {
        var card = player.hand.cards[i][j][k];
        if (player_can_place(card)) {
          ++placable_count;
        }
        var card_img = document.createElement("img");
        card_img.src = card.filePath;
        card_img.alt = "player card";
        card_img.className = "player-card";
        card_img.dataset.card = JSON.stringify(card);  // store card data in element
        card_img.addEventListener('click', handle_card_click);
        show_player_hand.appendChild(card_img);
      }
    }
  }
  player_has_placeable_cards = (placable_count > 0);
  if (player_has_placeable_cards) {
    place_button.classList.add("selected");
    draw_button.classList.remove("selected");
  } else {
    place_button.classList.remove("selected");
    draw_button.classList.add("selected"); 
  }
}

function add_bot_card() {
  var card_img = document.createElement("img");
  card_img.src = "../img/card\ back/card_back.png";
  card_img.alt = "bot card";
  show_bot_hand.appendChild(card_img);
}

function remove_bot_card() {
  show_bot_hand.removeChild(show_bot_hand.lastElementChild);
}

function remove_player_card() {
  display_player_hand();
}

function add_player_card() {
  display_player_hand();
}

function end_game(winner) {
  game_active = false;
  place_button.disabled = true;
  draw_button.disabled = true;
  place_button.classList.remove("selected");
  draw_button.classList.remove("selected");
  if (winner === "player") {  // show winner message
    alert("🎉 Congratulations! You won! 🎉");
  } else {
    alert("🤖 Bot wins! Better luck next time! 🤖");
  }
}

function init_game() {
  init_deck();
  var hand_bot = new Hand(deal_hand());
  var hand_player = new Hand(deal_hand());
  bot = new Player(hand_bot);
  player = new Player(hand_player);
  discard_pile = deal_starting_card();
  discard_pile_html_image.src = discard_pile.filePath;
  display_bot_hand();
  display_player_hand();
  player_turn = goes_first();
  if (player_turn) {
    console.log("Player goes first!");
  } else {
    console.log("Bot goes first!");
    if (game_active) {
      turn_bot();
      player_turn = true;
    }
  }
}

init_game();