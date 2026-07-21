export function buildToolTree(tools, categoryOrder) {
  return categoryOrder.map(id => ({
    id,
    tools: tools
      .filter(tool => tool.category === id)
      .toSorted((first, second) => first.order - second.order),
  }));
}

export function swapConversion({ input, output, from, to }) {
  return {
    input: output.trim() ? output : input,
    from: to,
    to: from,
  };
}

export function getCopyState(value, invalidValues = []) {
  return !value.trim() || invalidValues.includes(value) ? "disabled" : "ready";
}

export function serializeStatsResult({ characters, words, lines }) {
  return `Characters: ${characters}\nWords: ${words}\nLines: ${lines}`;
}
