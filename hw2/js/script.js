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

class Card {
  constructor(filePath, count, type, color) {
    this.filePath = filePath;
    this.count = count;
    this.type = type;
    this.color = color;
  }
}

class Hand {
  constructor(cards) {
    this.cards = cards;
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
      new Card("img/blue/0_blue.png", ZERO_COUNT, "number", "blue"),
      new Card("img/blue/1_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/2_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/3_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/4_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/5_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/6_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/7_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/8_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/9_blue.png", ONE_THROUGH_NINE_COUNT, "number", "blue"),
      new Card("img/blue/2plus_blue.png", ONE_THROUGH_NINE_COUNT, "action", "blue"),
      new Card("img/blue/block_blue.png", ONE_THROUGH_NINE_COUNT, "action", "blue"),
      new Card("img/blue/inverse_blue.png", ONE_THROUGH_NINE_COUNT, "action", "blue")
    ],
    // GREEN (index 1)
    [
      new Card("img/green/0_green.png", ZERO_COUNT, "number", "green"),
      new Card("img/green/1_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/2_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/3_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/4_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/5_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/6_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/7_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/8_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/9_green.png", ONE_THROUGH_NINE_COUNT, "number", "green"),
      new Card("img/green/2plus_green.png", ONE_THROUGH_NINE_COUNT, "action", "green"),
      new Card("img/green/block_green.png", ONE_THROUGH_NINE_COUNT, "action", "green"),
      new Card("img/green/inverse_green.png", ONE_THROUGH_NINE_COUNT, "action", "green")
    ],
    // RED (index 2)
    [
      new Card("img/red/0_red.png", ZERO_COUNT, "number", "red"),
      new Card("img/red/1_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/2_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/3_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/4_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/5_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/6_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/7_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/8_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/9_red.png", ONE_THROUGH_NINE_COUNT, "number", "red"),
      new Card("img/red/2plus_red.png", ONE_THROUGH_NINE_COUNT, "action", "red"),
      new Card("img/red/block_red.png", ONE_THROUGH_NINE_COUNT, "action", "red"),
      new Card("img/red/inverse_red.png", ONE_THROUGH_NINE_COUNT, "action", "red")
    ],
    // WILD (index 3)
    [
      new Card("img/wild/4_plus.png", WILD_COUNT, "action", "black"),
      new Card("img/wild/wild_card.png", WILD_COUNT, "action", "black")
    ],
    // YELLOW (index 4)
    [
      new Card("img/yellow/0_yellow.png", ZERO_COUNT, "number", "yellow"),
      new Card("img/yellow/1_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/2_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/3_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/4_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/5_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/6_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/7_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/8_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/9_yellow.png", ONE_THROUGH_NINE_COUNT, "number", "yellow"),
      new Card("img/yellow/2plus_yellow.png", ONE_THROUGH_NINE_COUNT, "action", "yellow"),
      new Card("img/yellow/block_yellow.png", ONE_THROUGH_NINE_COUNT, "action", "yellow"),
      new Card("img/yellow/inverse_yellow.png", ONE_THROUGH_NINE_COUNT, "action", "yellow")
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
        deck = init_deck();
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

function place_card() {
  return false; //  todo temp return
}

function turn(p) {
  if (!place_card(p)) {
    p.hand.cards.push(deal_card);
  }
}

function init_game() {
  init_deck();
  hand_bot = new Hand(deal_hand());
  hand_player = new Hand(deal_hand());
  bot = new Player(hand_bot);
  player = new Player(hand_player);
  var discard_pile = deal_card();
  var who = goes_first();
  while ((player.hand.cards.length > 0) && (bot.hand.cards.length > 0)) {
    if (who) {  //  player goes first
      turn(player);
      turn(bot);
    }
    turn(bot);
    turn(player);
  }

}

init_game();