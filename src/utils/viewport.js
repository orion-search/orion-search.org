export const largestDimension = () =>
  window.innerWidth > window.innerHeight
    ? window.innerWidth
    : window.innerHeight;

/**
 * Returns [0, 1] normalized screen coordinates
 * from lat/lon values
 *
 * @param {number} lat
 * @param {number} lng
 */
export const coordinatesToScreen = (
  lat,
  lng,
  screenWidth = window.innerWidth,
  screenHeight = window.innerHeight
) => {
  return {
    x: (lng + 180) * (screenWidth / 360),
    y: (lat * -1 + 90) * (screenHeight / 180)
  };
};
