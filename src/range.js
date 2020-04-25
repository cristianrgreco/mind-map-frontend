export const convertRange = (sourceRange, targetRange) => value =>
    (value - sourceRange[0]) * (targetRange[1] - targetRange[0]) / (sourceRange[1] - sourceRange[0]) + targetRange[0];
