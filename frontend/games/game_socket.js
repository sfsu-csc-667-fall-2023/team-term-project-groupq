import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { dealerHand, cardTemplate, gameSocketId, otherHandContainers } from "./page-data"


let socket;

const configure = () => {
  socket = io({ query: { id: gameSocketId } });

  socket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  socket.on('showPopup', (data) => {
    const errorMessage = data.message;  
    alert(errorMessage);
  });

  console.log("Game socket configured");
  return Promise.resolve(socket)
};

const dealerUpdate = (handContainer, cardList, pot_count) => {

  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    // This adds the input suit-{} number-{} as a class NAME -> EXTRACT FOR CSS
    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    handContainer.appendChild(div);
  });
  
};

const potCountUpdate = (handContainer, pot_count) => {
  const p = document.createElement("p");
  p.textContent = `Dealer Pot = ${pot_count}`;
  p.classList.add("pot-count");

  handContainer.appendChild(p);
};

const gamePhaseUpdate = (gamePhase) => {
  const p = document.getElementById("game-phase");
  p.textContent = `CURRENT GAME PHASE: ${gamePhase}`; //CURRENT GAME PHASE: PRE-FLOP
};

const updateDealerCards = (game_phase, pot_count) => {

  const filler = [{ suit: 'filler', number: 'filler'}];
  if (game_phase === "preflop") { // pre-flop (all cards are hidden)
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (game_phase === "flop") { // flop 3 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (game_phase === "turn") { // turn 4 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, turnCards, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (game_phase === "river") { // river 5 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, turnCards, pot_count);
    dealerUpdate(dealerHand, riverCards, pot_count);
  }
}

function createPlayerCards() {
  return {
    userId: [],
    suit: [],
    number: []
  };
}

function playerHandStrength(hand) {
  
  const pairs = hasDuplicates(hand.number);
  const isFlush = hasFlush(hand.suit);
  const isStraight = hasStraight(hand.number);

  //console.log("WHAT IS PAIR HERE", pairs, Object.keys(pairs).length == 1);
  if (isFlush !== 0 && isStraight !== 0 ) {

  }
  else if (isFlush !== 0 && isStraight !== 0) {
    // straight flush
    console.log("STRAIGHT FLUSH", isFlush, isStraight);
  }
  else if (isFlush !== 0 && isStraight === 0) {
    // flush
    console.log("FLUSH", isFlush, isStraight);
  }
  else if (isFlush === 0 && isStraight !== 0) {
    console.log("STRAIGHT", isFlush, isStraight);
  }

  else if (Object.keys(pairs).length === 0) { // HIGH CARD
    const maxNumber = Math.max(...hand.number);
    const maxIndex = hand.number.indexOf(maxNumber);
    console.log(maxNumber, hand.suit[maxIndex]);
    toString("High Card", maxNumber, hand.suit[maxIndex]);
    // return some scoring and the toString()
  }


  else if (Object.keys(pairs).length === 1) { // Pairs
    //console.log("DO YOU GO IN HEREPLSSS");
    for (const key in pairs) {
      if (pairs[key] == 2) { // Pair 
        toString("Pair ", " ", key);
      }
      else if (pairs[key] == 3) { // Three of a kind 
        toString("Three of a Kind ", " ", key);
      }
      else if (pairs[key] == 4) { // Four of a kind 
        toString("Four of a Kind ", " ", key);
      } 
    }
  }

  else if (Object.keys(pairs).length >= 2) { // 2 pairs, full house and four of a kind

    const cardTwos = [];
    const cardThrees = [];

    for (const key in pairs) {
      if (pairs[key] == 3) {   
        cardThrees.push(key)
      }
      if (pairs[key] == 2) {   
        cardTwos.push(key)
      }
      else if (pairs[key] == 4) { // FOUR OF A KIND
        toString("Four of a Kind ", " ", key);
      }
    }
    
    if (cardTwos.length == 2 && cardThrees.length == 0) { // 2 pairs
      const twoPairStrings = cardTwos.join(", ");
      toString("Two pairs ", " ", twoPairStrings);
    }
    else if (cardTwos.length == 3 && cardThrees.length == 0) { // need to filter the best 2 pairs
      const sortedNumbers = cardTwos.map(Number).sort((a, b) => b - a);
      const highestTwoValues = sortedNumbers.slice(0, 2);
      const twoPairStrings = highestTwoValues.join(", ");
      toString("Two pairs ", " ", twoPairStrings);
    }

    else if (cardTwos.length == 1 && cardThrees.length == 1) { // full house
      const fullHouse = cardTwos[0].concat(" and ", cardThrees[0]);
      toString("Full House", " ", fullHouse);
    }

    else if (cardThrees.length == 2) { // find the bigger three of a kind
      if (parseInt(cardThrees[0]) < parseInt(cardThrees[1])) {
        toString("Three of a Kind ", " ", cardThrees[1]);
      }
      else {
        toString("Three of a Kind ", " ", cardThrees[0]);
      }
    }
  }



}

const hasDuplicates = (numbers) => {
  const frequencyCounter = {};
  for (const element of numbers) {
    frequencyCounter[element] = (frequencyCounter[element] || 0) + 1;
  }

  //console.log("PAIRS", frequencyCounter);
  const pairs = Object.fromEntries(
    Object.entries(frequencyCounter).filter(([key, value]) => value >= 2));
  
  console.log("PAIRS", pairs, Object.keys(pairs).length == 1);
  if (Object.keys(pairs).length === 0) {
    return 0;
  }
  else {
    return pairs;
  }
}

const hasFlush = (suits) => {
  const frequencyCounter = {};
  for (const element of suits) {
    frequencyCounter[element] = (frequencyCounter[element] || 0) + 1;
  }
  for (const key in frequencyCounter) {
    //console.log(`Key: ${key}, Value: ${frequencyCounter[key]}`);
    if (frequencyCounter[key] === 5) {
      return key;
    }
  }
  //console.log("THIS IS INSIDE THE FLUSH", frequencyCounter)
  return 0;
}

const hasStraight = (numbers) => {
  const sortedNumbers = numbers.map(Number).sort((a, b) => a - b);

  const sequenceOne = sortedNumbers.slice(0, 5);
  const sequenceTwo = sortedNumbers.slice(1, 6);
  const sequenceThree = sortedNumbers.slice(2, 7);

  const isSequence = (sequence) => {
    for (let i=1; i<5; i++) {
      if ((sequence[i-1]+1) != (sequence[i])) {
        return false;
      }
    }
    return true;
  }

  const isSequenceOne = isSequence(sequenceOne);
  const isSequenceTwo = isSequence(sequenceTwo);
  const isSequenceThree = isSequence(sequenceThree);
  //console.log("THIS IS INSIDE THE STRAIGHT", sequenceOne, sequenceTwo, sequenceThree, isSequenceOne, isSequenceTwo, isSequenceThree);
  if (isSequenceOne && !isSequenceTwo && !isSequenceThree) {
    const lastItem = sequenceOne.pop();
    return lastItem;
  }
  else if (isSequenceTwo && !isSequenceThree) {
    const lastItem = sequenceTwo.pop();
    return lastItem;
  }
  else if (isSequenceThree) {
    const lastItem = sequenceThree.pop();
    return lastItem;
  }
  else if (!isSequenceOne && !isSequenceTwo && !isSequenceThree) {
    return 0;
  }
};

const toString = (rank, number, suit) => {
  let s;
  if (number == 11) {
    s = "Jack";
  }
  else if (number == 12) {
    s = "Queen";
  }

  else if (number == 13) {
    s = "King";
  }
  else {
    s = String(number)
  }
  const cardString = `${rank}, ${s} of ${suit}`;
  console.log(cardString);
  return cardString;
}

// get the data from game_state
const stateUpdated = ({ game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards, pot_count, updateGamePhase }) => {
  //console.log(GAME_CONSTANTS.STATE_UPDATED, { game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards, pot_count, updateGamePhase })

  gamePhaseUpdate(updateGamePhase.game_phase);
  updateDealerCards(updateGamePhase.game_phase, pot_count);

  const dealerCards = {suit: [], number: []};
  const playerCardsArray = [];

  const handStrength = players.map(({ hand }) => hand);
  //console.log("HAND STRENGTH", handStrength);
  handStrength.forEach((hand) => {
    if (hand.length !== 2) {
      hand.forEach(({ suit, number}) => {
        dealerCards.suit.push(suit);
        dealerCards.number.push(number);
      });
    }
    else {
      const playerCards = createPlayerCards();
      hand.forEach(({ user_id, suit, number}) => {
        playerCards.userId.push(user_id);
        playerCards.suit.push(suit);
        playerCards.number.push(number);
      });
      playerCardsArray.push(playerCards);
    }
  });


  playerCardsArray.forEach((player) => {
    for(let i=0; i<5; i++) {
      player.suit.push(dealerCards.suit[i]);
      player.number.push(dealerCards.number[i]);
    }
  });


  
  

  const test = 
  {"userId": [
        1,
        1
    ],
    "suit": [
        "hearts",
        "hearts",
        "hearts",
        "diamonds",
        "hearts",
        "clubs",
        "diamonds"
    ],
    "number": [
        9,
        10,
        11,
        11,
        9,
        10,
        7
    ]};

    console.log("LETS MAKE A TEMPLATE TO TEST", test);
    playerHandStrength(test);

};



export { configure };

/*
{
    "userId": [
        1,
        1
    ],
    "suit": [
        "hearts",
        "hearts",
        "hearts",
        "hearts",
        "hearts",
        "clubs",
        "diamonds"
    ],
    "number": [
        11,
        4,
        6,
        5,
        10,
        8,
        9
    ]
}

*/