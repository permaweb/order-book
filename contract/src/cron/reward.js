import { allocate } from "../lib/allocate.js";
import { sum, values, keys, assoc } from "ramda";
// We need to evaluate STREAK Object adding points multiplier
// create distribution object
// identify the REWARD via halving cycle
// feed distribution object in to allocate function
const DAY = 720;
const TOTAL_SUPPLY = 26_280_000 * 1e6;
const HALVING_SUPPLY = 26_280_000 * 1e6;
const ORIGIN_HEIGHT = 1209700;
const CYCLE_INTERVAL = DAY * 365; // 1 year

// reward sponsors of stamped assets
export function reward(state) {
  if (state.lastReward + DAY >= SmartWeave.block.height) {
    return state;
  }
  if (keys(state.streaks).length < 1) {
    return state;
  }
  const { reward } = setReward(SmartWeave.block.height)({ state });

  if (reward === 0) {
    return state; // do not run mint
  }

  const streaks = assignPoints(state.streaks);
  // allocate reward
  state.recentRewards = allocate(streaks, reward);
  // update balances
  state = updateBalances({ state, rewards: state.recentRewards });
  // set lastReward
  state.lastReward = SmartWeave.block.height;
  return state;
}

function assignPoints(streaks) {
  return keys(streaks).reduce((a, k) => {
    if (streaks[k].days > 0) {
      const multiplier = streaks[k].days - 1;
      return assoc(k, 1 + multiplier * 0.1, a);
    } else {
      return a;
    }
  }, {});
}

function setReward(height) {
  return ({ state }) => {
    const S100 = 1 * 1e6;

    const current = sum(values(state.balances)) || 0;

    if (current >= HALVING_SUPPLY) {
      if (!state.balances[contractId]) {
        state.balances[contractId] = 0;
      }
      return 0;
    }
    const reward = getReward(
      HALVING_SUPPLY,
      CYCLE_INTERVAL,
      height,
      ORIGIN_HEIGHT
    );
    return { state, reward };
  };
}

function updateBalances({ state, rewards }) {
  keys(rewards).forEach((k) => {
    if (!state.balances[k]) {
      state.balances[k] = 0;
    }
    state.balances[k] += rewards[k];
  });
  return state;
}

function getReward(supply, interval, currentHeight, originHeight) {
  const blockHeight = currentHeight - originHeight;
  const currentCycle = Math.floor(blockHeight / interval) + 1;
  const divisor = Math.pow(2, currentCycle);
  const reward = Math.floor(Math.floor(supply / divisor) / 365);
  // Debug
  // console.log({ supply, interval, currentHeight, originHeight })
  // console.log('blockHeight', blockHeight)
  // console.log('current cycle', currentCycle)
  // console.log('divisor', divisor)
  // console.log('reward', reward)
  return reward;
}
