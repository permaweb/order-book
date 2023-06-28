export function calculateStreak(lastHeight = 0, currentHeight = 0, streak = 0) {
  if (streak === 0) {
    return { days: 1, lastHeight: currentHeight };
  }

  if (streak >= 30) {
    return { days: 1, lastHeight: currentHeight };
  }

  const diff = currentHeight - lastHeight;

  if (diff <= 720) {
    return { days: streak, lastHeight: lastHeight };
  }

  if (diff > 720 && diff <= 1440) {
    return { days: streak + 1, lastHeight: currentHeight };
  }

  if (diff > 1440) {
    return { days: 1, lastHeight: currentHeight };
  }

  return { days: 0, lastHeight: 0 };
}
