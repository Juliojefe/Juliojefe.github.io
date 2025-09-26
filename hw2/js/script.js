let BLUE = 0;
let GREEN = 1;
let RED = 2;
let WILD = 3;
let YELLOW = 4;
let ZERO_COUNT = 1;
let ONE_THROUGH_NINE_COUNT = 2;
let WILD_COUNT = 4;
let STARTING_HAND_SIZE = 7;
let DECK_SIZE = 108;
var used_cards = 0;
var deck = [];
let bot;
let player;
var discard_pile;

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
  }
  sort_cards(cards) {
    var categorize = [
      [[], []],  // BLUE: [numbers, actions]
      [[], []],  // GREEN: [numbers, actions] 
      [[], []],  // RED: [numbers, actions]
      [],        // WILD: all wild cards
      [[], []]   // YELLOW: [numbers, actions]
    ];
    for (var i = 0; i < cards.length; ++i) {
      var cur_card = cards[i];
      var index = get_place_index(cur_card);
      if (index == WILD) {
        categorize[WILD].push(cur_card);  //  wild card
      } else if (cur_card.type == "number") {
        categorize[index][0].push(cur_card);  //  number card
      } else {
        categorize[index][1].push(cur_card);  //  action card
      }
    }
    return categorize;
  }
  sort_single_card(card) {
    var index = get_place_index(card);
    if (index == WILD) {
      this.cards[WILD].push(card);  // wild card
    } else if (card.type == "number") {
      this.cards[index][0].push(card);  // number card
    } else {
      this.cards[index][1].push(card);  // action card
    }
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
      new Card("img/blue/0_blue.png", ZERO_COUNT, "number", "blue", 0),
      new Card("img/blue/1_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 1),
      new Card("img/blue/2_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 2),
      new Card("img/blue/3_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 3),
      new Card("img/blue/4_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 4),
      new Card("img/blue/5_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 5),
      new Card("img/blue/6_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 6),
      new Card("img/blue/7_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 7),
      new Card("img/blue/8_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 8),
      new Card("img/blue/9_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue", 9),
      new Card("img/blue/2plus_blue.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "blue", -1),
      new Card("img/blue/block_blue.png", ONE_THROUGH_NINE_COUNT, "action_block", "blue", -2),
      new Card("img/blue/inverse_blue.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "blue", -3)
    ],
    // GREEN (index 1)
    [
      new Card("img/green/0_green.png", ZERO_COUNT, "number", "green", 0),
      new Card("img/green/1_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 1),
      new Card("img/green/2_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 2),
      new Card("img/green/3_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 3),
      new Card("img/green/4_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 4),
      new Card("img/green/5_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 5),
      new Card("img/green/6_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 6),
      new Card("img/green/7_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 7),
      new Card("img/green/8_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 8),
      new Card("img/green/9_green.png", ONE_THROUGH_NINE_COUNT, "number", "green", 9),
      new Card("img/green/2plus_green.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "green", -1),
      new Card("img/green/block_green.png", ONE_THROUGH_NINE_COUNT, "action_block", "green", -2),
      new Card("img/green/inverse_green.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "green", -3)
    ],
    // RED (index 2)
    [
      new Card("img/red/0_red.png", ZERO_COUNT, "number", "red", 0),
      new Card("img/red/1_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 1),
      new Card("img/red/2_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 2),
      new Card("img/red/3_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 3),
      new Card("img/red/4_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 4),
      new Card("img/red/5_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 5),
      new Card("img/red/6_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 6),
      new Card("img/red/7_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 7),
      new Card("img/red/8_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 8),
      new Card("img/red/9_red.png", ONE_THROUGH_NINE_COUNT, "number", "red", 9),
      new Card("img/red/2plus_red.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "red", -1),
      new Card("img/red/block_red.png", ONE_THROUGH_NINE_COUNT, "action_block", "red", -2),
      new Card("img/red/inverse_red.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "red", -3)
    ],
    // WILD (index 3)
    [
      new Card("img/wild/4_plus.png", WILD_COUNT, "action", "black", -4),
      new Card("img/wild/wild_card.png", WILD_COUNT, "action", "black", -4)
    ],
    // YELLOW (index 4)
    [
      new Card("img/yellow/0_yellow.png", ZERO_COUNT, "number", "yellow", 0),
      new Card("img/yellow/1_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 1),
      new Card("img/yellow/2_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 2),
      new Card("img/yellow/3_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 3),
      new Card("img/yellow/4_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 4),
      new Card("img/yellow/5_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 5),
      new Card("img/yellow/6_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 6),
      new Card("img/yellow/7_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 7),
      new Card("img/yellow/8_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 8),
      new Card("img/yellow/9_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow", 9),
      new Card("img/yellow/2plus_yellow.png", ONE_THROUGH_NINE_COUNT, "action_plus2", "yellow", -1),
      new Card("img/yellow/block_yellow.png", ONE_THROUGH_NINE_COUNT, "action_block", "yellow", -2),
      new Card("img/yellow/inverse_yellow.png", ONE_THROUGH_NINE_COUNT, "action_inverse", "yellow", -3)
    ]
  ];
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
  } else if (card.color == "black") {
    index = WILD;
  } else {
    index = YELLOW;
  }
  return index;
}

function place_card_bot() {
  var color_of_pile = discard_pile.color;
  var number_of_pile = discard_pile.numeric_value;
  var type_of_pile = discard_pile.type;
  var loc_of_pile_index = get_place_index(discard_pile);  //  BLUE, GREEN, RED, WILD, YELLOW
  //  now that I have data on the pile I need to check what is available for use
  var available_same_color_number;
  var available_diff_color_same_number;
  var available_same_color_action;
  var available_diff_color_same_action;
  var available_wild;
  var available_plus_four;
  if (loc_of_pile_index != WILD && bot.hand.cards[loc_of_pile_index].length > 0) {  //  card/s of the same color in hand
    // Check same color cards
  }
  
  if (bot.hand.cards[WILD].length > 0) {  //  wild card/s in hand
    // Check wild cards
  }
  //  outside of an if check for matching numbers in other colors
  //  always check for matching numbers no if needed
  return false;
}

function turn_player() {
  //  player choses what to do during their turn
}

function turn_bot() { //  scripted turn
  if (!place_card_bot()) {
    bot.hand.sort_single_card(deal_card());
  }
}

function init_game() {
  init_deck();
  hand_bot = new Hand(deal_hand());
  hand_player = new Hand(deal_hand());
  bot = new Player(hand_bot);
  player = new Player(hand_player);
  discard_pile = deal_card();
  var who = goes_first();
  while ((player.hand.cards.length > 0) && (bot.hand.cards.length > 0)) {
    if (who) {  //  player goes first
      turn_player(player);
      turn_bot(bot);
    }
    turn_bot();
    turn_player();
  }

}

init_game();