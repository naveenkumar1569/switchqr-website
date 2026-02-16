/**
 * Calculates a "nice" scale for a chart Y-axis.
 * Returns a max value that is a multiple of 5, 10, or suitable power of 10,
 * and an array of 5 tick marks (including 0).
 *
 * @param {number} maxDataValue - The maximum value in the dataset.
 * @returns {object} { max: number, ticks: number[] }
 */
export const calculateChartScale = (maxDataValue) => {
    // Ensure we have at least a minimum max value (e.g., 10)
    let max = Math.max(maxDataValue, 10);

    // Calculate a "nice" max value
    // We want the max to be divisible by 4 (so we can have 5 ticks: 0, 25%, 50%, 75%, 100%)
    // and ideally be a round number like 10, 20, 50, 100, etc.

    // Simple approach: Round up to the nearest multiple of 4 that is > max
    // But for better visuals, let's try to find a "nice" number.

    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const normalized = max / magnitude;

    let niceMax;
    if (normalized <= 1) niceMax = 1 * magnitude;
    else if (normalized <= 2) niceMax = 2 * magnitude;
    else if (normalized <= 5) niceMax = 5 * magnitude;
    else niceMax = 10 * magnitude;

    // If the data max is very close to the nice max, bump it up to the next level
    // to give some headroom (except for exact matches)
    if (max > niceMax) niceMax *= 2; // e.g., if max is 6 and niceMax is 5, go to 10.
    if (max > niceMax) niceMax *= 2.5; // Correction if jumped from 2->5 needs 5->10

    // Force niceMax to be at least divisible by 4 for clean integer ticks if possible
    // If niceMax is small (< 20), simply rounding to nearest 4 might be better
    if (niceMax < 20) {
        niceMax = Math.ceil(max / 4) * 4;
        if (niceMax < 10) niceMax = 10; // maintain min 10
    }

    // Ensure strictly integer ticks if niceMax is large enough
    if (niceMax % 4 !== 0) {
        niceMax = Math.ceil(niceMax / 4) * 4;
    }

    const ticks = [niceMax, niceMax * 0.75, niceMax * 0.5, niceMax * 0.25, 0];

    // Ensure ticks are integers
    const integerTicks = ticks.map(t => Math.round(t));

    return {
        max: integerTicks[0],
        ticks: integerTicks
    };
};
