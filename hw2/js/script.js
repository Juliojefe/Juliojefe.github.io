let BLUE = 0;
let GREEN = 1;
let RED = 2;
let YELLOW = 3;
let ZERO_COUNT = 1;
let ONE_THROUGH_NINE_COUNT = 2;
let STARTING_HAND_SIZE = 7;
let DECK_SIZE = 100;
var used_cards = 0;
var deck = [];
let bot;
let player;
var discard_pile;
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
  constructor(owner, cards) {
    this.owner = owner;
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
  addCard(card) {
    var index = get_place_index(card);
    if (card.type == "number") {
      this.cards[index][0].push(card);  // number card
    } else {
      this.cards[index][1].push(card);  // action card
    }
    ++this.card_count;
    this.owner.addCardToDisplay();
  }
  removeCard(card) {
    --this.card_count;
    var card_color_index = get_place_index(card);
    var number_or_action;
    if (card.type == "number") {
      number_or_action = 0;
    } else {
      number_or_action = 1;
    }
    var target_array = this.cards[card_color_index][number_or_action];
    var card_index = -1;
    for (var i = 0; i < target_array.length; i++) {
      if (target_array[i].filePath === card.filePath) {
        card_index = i;
        break;
      }
    }
    if (card_index !== -1) {
      target_array.splice(card_index, 1);
      this.owner.removeCardFromDisplay();
      if (this.card_count === 0) {
        if (this.owner.isBot) {
          end_game("bot");
        } else {
          end_game("player");
        }
      }
      return true;
    }
    return false;
  }
}

class Player {
  constructor(isBot) {
    this.isBot = isBot;
    if (isBot) {
      this.showHandElement = show_bot_hand;
    } else {
      this.showHandElement = show_player_hand;
    }
  }
  setHand(hand) {
    this.hand = hand;
  }
  displayHand() {
    this.showHandElement.innerHTML = "";
    if (this.hand.card_count === 0) {
      if (this.isBot) {
        end_game("bot");
      } else {
        end_game("player");
      }
      return;
    }
    if (this.isBot) {
      for (var i = 0; i < this.hand.card_count; i++) {
        var cardImg = document.createElement("img");
        cardImg.src = "../img/card back/card_back.png";
        cardImg.alt = "bot card";
        this.showHandElement.appendChild(cardImg);
      }
    } else {
      var placeable_count = 0;
      for (var i = 0; i < this.hand.cards.length; i++) {
        for (var j = 0; j < this.hand.cards[i].length; j++) {
          for (var k = 0; k < this.hand.cards[i][j].length; k++) {
            var card = this.hand.cards[i][j][k];
            if (this.canPlace(card)) {
              ++placeable_count;
            }
            var card_img = document.createElement("img");
            card_img.src = card.filePath;
            card_img.alt = "player card";
            card_img.className = "player-card";
            card_img.dataset.card = JSON.stringify(card);
            card_img.addEventListener('click', handle_card_click);
            this.showHandElement.appendChild(card_img);
          }
        }
      }
      player_has_placeable_cards = (placeable_count > 0);
      if (player_has_placeable_cards) {
        place_button.classList.add("selected");
        draw_button.classList.remove("selected");
      } else {
        place_button.classList.remove("selected");
        draw_button.classList.add("selected"); 
      }
    }
  }
  addCardToDisplay() {
    if (this.isBot) {
      var card_img = document.createElement("img");
      card_img.src = "../img/card back/card_back.png";
      card_img.alt = "bot card";
      this.showHandElement.appendChild(card_img);
    } else {
      this.displayHand();
    }
  }
  removeCardFromDisplay() {
    if (this.isBot) {
      this.showHandElement.removeChild(this.showHandElement.lastElementChild);
    } else {
      this.displayHand();
    }
  }
  canPlace(card) {
    var card_color_index = get_place_index(card);
    var discard_color_index = get_place_index(discard_pile);
    return (card_color_index === discard_color_index) || (card.numeric_value === discard_pile.numeric_value);
  }
  handleActionEffects() {
    if (discard_pile.type != "number") {
      if (discard_pile.type == "action_plus2") {
        this.hand.addCard(deal_card());
        this.hand.addCard(deal_card());
        mask_discard_pile();
        return true;
      } else {
        mask_discard_pile();
        return true;
      }
    }
    return false;
  }
  placeRandomCard() {
    var loc_of_pile_index = get_place_index(discard_pile);
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
    var curl_loc = this.hand.cards[loc_of_pile_index];
    for (var i = 0; i < curl_loc.length; ++i) {
      var cur_section = curl_loc[i];
      for (var j = 0; j < cur_section.length; ++j) {
        var cur_card = cur_section[j];
        if (i == 0) {
          same_color_number.push(cur_card);
        } else {
          same_color_action.push(cur_card);
        }
      }
    }
    for (var i = 0; i < this.hand.cards.length; ++i) {
      if (i == loc_of_pile_index) {
        continue;
      }
      var cur_color = this.hand.cards[i];
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
    for (var i = 0; i < all_available.length; ++i) {
      if (all_available[i].cards.length > 0) {
        filtered_available.push(all_available[i]);
      }
    }
    if (filtered_available.length === 0) {
      return false;
    }
    var selected_category_index;
    var selected_card;
    do {
      selected_category_index = Math.floor(Math.random() * filtered_available.length);
    } while (filtered_available[selected_category_index].cards.length == 0);
    var selected_category = filtered_available[selected_category_index];
    if (selected_category.cards.length == 1) {
      selected_card = selected_category.cards[0];
    } else {
      var card_index = Math.floor(Math.random() * selected_category.cards.length);
      selected_card = selected_category.cards[card_index];
    }
    discard_pile = selected_card;
    discard_pile_html_image.src = selected_card.filePath;
    this.hand.removeCard(selected_card);
    return true;
  }
  placeIfPossible(card) {
    if (this.canPlace(card)) {
      discard_pile = card;
      discard_pile_html_image.src = card.filePath;
      this.hand.removeCard(card);
      return true;
    } else {
      return false;
    }
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
    // YELLOW (index 3)
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
  if (selected_card && player.canPlace(selected_card)) {
    discard_pile = selected_card;
    discard_pile_html_image.src = selected_card.filePath;
    player.hand.removeCard(selected_card);
    if (selectedCardElement) {
      selectedCardElement.classList.remove("selected");
    }
    selected_card = null;
    selectedCardElement = null;
    if (!game_active) {
      return;
    }
    if (discard_pile.type !== "number") {
      bot.handleActionEffects();  //  player played action card
      return;
    }
    player_turn = false;
    turn_bot();
    player_turn = true;
  }
}

draw_button.addEventListener("click", handle_draw);
function handle_draw() {
  if (!game_active || !player_turn) {
    return;
  }
  var card = deal_card();
  player.hand.addCard(card);
  if (player.canPlace(card)) {
    player_has_placeable_cards = true;
  } else {
    player_turn = false;
    if (game_active && !player_turn) {
      turn_bot();
      player_turn = true;
    }
  }
}

function deal_starting_card() {
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
    }
  }
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
  coin_flip = Math.floor(Math.random() * 10);
  if (coin_flip <= 4) {
    return true;
  }
  return false;
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
  //  create new because reference vs copy
  discard_pile = new Card(discard_pile.filePath, discard_pile.count, "number", discard_pile.color, discard_pile.numeric_value);
}

function turn_bot() {
  if (!game_active || player_turn) {
    return;
  }
  if (bot.handleActionEffects()) {
    return;
  } else {
    var placed = bot.placeRandomCard();
    if (!placed) {
      var card = deal_card();
      bot.hand.addCard(card);
      bot.placeIfPossible(card);
    }
    if (discard_pile.type !== "number") { //  action was played
      player.handleActionEffects();
      return;
    }
  }
}

function handle_card_click(event) {
  var cardElement = event.target;
  var cardData = JSON.parse(cardElement.dataset.card);
  if (selectedCardElement) {
    selectedCardElement.classList.remove("selected");
  }
  cardElement.classList.add("selected");
  selected_card = cardData;
  selectedCardElement = cardElement;
  if (player.canPlace(selected_card)) {
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

function end_game(winner) {
  game_active = false;
  place_button.disabled = true;
  draw_button.disabled = true;
  place_button.classList.remove("selected");
  draw_button.classList.remove("selected");
  if (winner === "player") {
    alert("🎉 Congratulations! You won! 🎉");
  } else {
    alert("🤖 Bot wins! Better luck next time! 🤖");
  }
}

function init_game() {
  init_deck();
  var hand_bot_cards = deal_hand();
  var hand_player_cards = deal_hand();
  bot = new Player(true);
  player = new Player(false);
  bot.setHand(new Hand(bot, hand_bot_cards));
  player.setHand(new Hand(player, hand_player_cards));
  discard_pile = deal_starting_card();
  discard_pile_html_image.src = discard_pile.filePath;
  bot.displayHand();
  player.displayHand();
  player_turn = goes_first();
  if (!player_turn) { //  bot goes first
    if (game_active) {
      turn_bot();
      player_turn = true;
    }
  }
}

init_game();