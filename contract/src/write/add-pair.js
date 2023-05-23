import { of, Left, Right } from "../lib/either.js";

export function addPair(state, action) {
  return of({ state, action }).chain(validate).map(updatePairs);
}

function updatePairs({ state, action }) {
  state.pairs.push({
    pair: action.input.pair,
    orders: [],
  });

  return { state };
}

function validate({ state, action }) {
  if (!state.pairs) {
    state.pairs = [];
  }

  if (!action.input.pair) {
    return Left("pair is required");
  }

  if (!action.input.pair[0].length === 43) {
    return Left("Each pair must be a contract address");
  }

  if (!action.input.pair[1].length === 43) {
    return Left("Each pair must be a contract address");
  }
  if (
    state.pairs.find(
      ({ pair: existingPair }) =>
        existingPair.includes(action.input.pair[0]) &&
        existingPair.includes(action.input.pair[1])
    )
  ) {
    return Left("Pair already exists");
  }

  return Right({ state, action });
}
