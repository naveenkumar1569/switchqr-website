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

    // We want to find a "nice" step size so that the max value is covered
    // by a reasonable number of steps (e.g. 4 or 5).
    // Preferred steps are multiples of 1, 2, 5 * magnitude (e.g. 10, 20, 50, 100...)

    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    // Try to fit into 5 intervals (dividing by 5 is nice for base-10)
    const rawStep = max / 5;

    let niceStep;

    // Check various nice steps derived from magnitude
    // Possible steps: 1x, 2x, 2.5x, 5x, 10x of magnitude
    const allowedMultipliers = [1, 2, 2.5, 5, 10];

    // We calculate candidate step based on magnitude of rawStep
    // If rawStep is 46, magnitude is 10. Normalized is 4.6.
    // If rawStep is 8, magnitude is 1. Normalized is 8.

    const stepMagnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalizedStep = rawStep / stepMagnitude;

    let bestMultiplier = 10;
    for (const m of allowedMultipliers) {
        if (m >= normalizedStep) {
            bestMultiplier = m;
            break;
        }
    }

    niceStep = bestMultiplier * stepMagnitude;

    // Make sure step is an integer (unless values are small and we want decimals? assume integers for scans)
    niceStep = Math.ceil(niceStep);

    // Calculate new max based on 5 intervals
    // 0, 1*step, 2*step, 3*step, 4*step, 5*step.

    const tickCount = 5;

    // Generate ticks
    // We return highest to lowest for rendering stack
    const ticks = [];
    for (let i = tickCount; i >= 0; i--) {
        ticks.push(niceStep * i);
    }

    return {
        max: ticks[0],
        ticks: ticks
    };
};
