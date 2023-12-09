

const getBestCards = (players) => {
    const playerCardsArray = extractCardInformation(players);
    for (let i=0; i<playerCardsArray.length; i++) {
    players.forEach(({ user_id, username }) => {
        if (playerCardsArray[i].userId[0] == user_id) {
        playerCardsArray[i].username = username;
        }
    });
    }

    const playerInfo = (userId, username, scores, handRank) => {
        const info = {
            userId,
            username,
            scores,
            handRank
        }
        return info
    }

    const playerScores = [];
    playerCardsArray.forEach((playerHand) => {
        const {score, rank} = playerHandStrength(playerHand);
        const infoStructure = playerInfo(playerHand.userId, playerHand.username, score, rank);
        playerScores.push(infoStructure);
    });

    let bestScore;
    let bestUsername;
    let bestHand;
    let bestUserId

    for (let i=0; i<playerScores.length; i++) {
    if (i == 0) {
        bestScore = playerScores[i].scores;
        bestUsername = playerScores[i].username;
        bestHand = playerScores[i].handRank;
        bestUserId = playerScores[i].userId[0];
    }
    else {
        if (bestScore < playerScores[i].scores){
        bestScore = playerScores[i].scores;
        bestUsername = playerScores[i].username;
        bestHand = playerScores[i].handRank;
        bestUserId = playerScores[i].userId[0];
        }
    }
    }
    return { bestScore, bestUsername, bestHand, bestUserId }
}
function createPlayerCards() {
return {
    userId: [],
    suit: [],
    number: []
};
}
      
function extractCardInformation(players) {
const dealerCards = {suit: [], number: []};
const playerCardsArray = [];

const handStrength = players.map(({ hand }) => hand);
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
return playerCardsArray;
}
      
function playerHandStrength(hand) {

const pairs = hasDuplicates(hand.number);
const isFlush = hasFlush(hand.suit);
const isStraight = hasStraight(hand.number);
let score = 0;
let rank;

if (isFlush !== 0 && isStraight !== 0 && isStraight == 14) {
    score = (14*3) + parseInt(isStraight); 
    rank = "Royal Straight Flush";
}
else if (isFlush !== 0 && isStraight !== 0) { // straight flush
    score = (14*8) + parseInt(isStraight);
    rank = toString("Straight Flush ", " ",isStraight);
}
else if (isFlush !== 0 && isStraight === 0) { // flush
    const highestFlush = hand.number.map(Number);
    const maxValue = Math.max(...highestFlush);
    score = (14*5) + maxValue; 
    rank = toString("Flush", "", isFlush);
}
else if (isFlush === 0 && isStraight !== 0) { // Straight
    score = (14*4) + isStraight;
    rank = toString("Flush", "", isStraight);
}

else if (Object.keys(pairs).length === 0) { // HIGH CARD
    const maxNumber = Math.max(...hand.number);
    const maxIndex = hand.number.indexOf(maxNumber);
    score = (14*0) + maxNumber;
    rank = toString("High Card", maxNumber, hand.suit[maxIndex]);    
}

else if (Object.keys(pairs).length === 1) { // Pairs
    for (const key in pairs) {
        if (pairs[key] == 2) { // Pair 
            rank = toString("Pair ", "",key);
            score = (14*1) + parseInt(key);
        }
        else if (pairs[key] == 3) { // Three of a kind 
            rank = toString("Three of a Kind ", "", key);
            score = (14*3) + parseInt(key);
        }
        else if (pairs[key] == 4) { // Four of a kind 
            rank = toString("Four of a Kind ", "", key);
            score = (14*7) + parseInt(key);
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
            toString("Four of a Kind ", "", key);
            score = (14*7) + parseInt(key);
        }
    }
    
    if (cardTwos.length == 2 && cardThrees.length == 0) { // 2 pairs
        const twoPairStrings = cardTwos.join(", ");
        rank = toString("Two pairs ", "", twoPairStrings);
        console.log(cardTwos);
        if (parseInt(cardTwos[0]) < parseInt(cardTwos[1])) {
            score = (14*2) + parseInt(cardTwos[1]);
        }
        else {
            score = (14*2) + parseInt(cardTwos[0]);
        }
    }
    else if (cardTwos.length == 3 && cardThrees.length == 0) { // need to filter the best 2 pairs
        const sortedNumbers = cardTwos.map(Number).sort((a, b) => b - a);
        const highestTwoValues = sortedNumbers.slice(0, 2);
        const twoPairStrings = highestTwoValues.join(", ");
        rank = toString("Two pairs ", " ", twoPairStrings);
        if (parseInt(cardTwos[0]) < parseInt(cardTwos[1])) {
            if (parseInt(cardTwos[1]) < parseInt(cardTwos[2])) {
            score = (14*2) + parseInt(cardTwos[2]);
            }
            else {
            score = (14*2) + parseInt(cardTwos[1]);
            }
        }
        else {
            if (parseInt(cardTwos[0]) < parseInt(cardTwos[2])) {
            score = (14*2) + parseInt(cardTwos[2]);
            }
            else {
            score = (14*2) + parseInt(cardTwos[0]);
            }
        }
    }

    else if (cardTwos.length >= 1 && cardThrees.length >= 1) { // full house
        const fullHouse = cardTwos[0].concat(" and ", cardThrees[0]);
        rank = toString("Full House", "", fullHouse);
        score = (14*6) + parseInt(cardThrees[0]);
    }
}

return {score, rank};
}
      
const hasDuplicates = (numbers) => {
    const frequencyCounter = {};
    for (const element of numbers) {
        frequencyCounter[element] = (frequencyCounter[element] || 0) + 1;
    }

    const pairs = Object.fromEntries(
    Object.entries(frequencyCounter).filter(([key, value]) => value >= 2));

    console.log(pairs, Object.keys(pairs).length == 1);
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
        if (frequencyCounter[key] >= 5) {
        return key;
        }
    }
    return 0;
}

const hasStraight = (numbers) => {
    const sortedNumbers = numbers.map(Number).sort((a, b) => a - b);
    const noDuplicatesSortedNumbers = Array.from(new Set(sortedNumbers));

    const isSequence = (sequence) => {
        let counter = 0;
        for (let i=1; i<noDuplicatesSortedNumbers.length; i++) {
        if ((sequence[i]-sequence[i-1]) != 1) {
            if (i <= (noDuplicatesSortedNumbers.length - 5)) {
            continue;
            }
            else {
            return 0;
            }
        }
        else {
            counter++;        
            if (counter >= 4) {
            return sequence[i];
            }
        }
        }
    }
    return isSequence(noDuplicatesSortedNumbers);
};

const toString = (rank, number, suit) => {
    let s;

    console.log(suit);
    if (number == 11) {
        s = "Jack";
    }
    else if (number == 12) {
        s = "Queen";
    }
    else if (number == 13) {
        s = "King";
    }
    else if (number == 14) {
        s = "Ace";
    }
    else {
        s = String(number)
    }

    if (number.length == 0) {
        if (suit == 14) {
        suit = "Ace";
        }
        else if (suit == 13) {
        suit = "King";
        }
        else if (suit == 12) {
        suit = "Queen";
        }
        else if (suit == 11) {
        suit = "Jack";
        }
    }
    const cardString = `${rank}, ${s} of ${suit}`;
    return cardString;
}













module.exports = { getBestCards, playerHandStrength };