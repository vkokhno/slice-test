import "core-js/stable";
import { ACTIONS, BORDERS } from "./constants";

// find matrix of distances between each coordinate
export const getDistanceMatrix = (coordinates: Array<Array<number>>) => {
  const distanceMatrix = [];

  // launch a loop for each coordinate
  for (let i = 0; i < coordinates.length; i++) {
    const distances: Array<number> = [];

    // get other coordinates
    for (let j = 0; j < coordinates.length; j++) {
      if (i === j) {
        // distance to itself set infinity
        distances.push(Infinity);
        continue;
      }

      // calculate distance like |x2 - x1| + |y2 - y1|
      const distance =
        Math.abs(coordinates[i][0] - coordinates[j][0]) +
        Math.abs(coordinates[i][1] - coordinates[j][1]);

      distances.push(distance);
    }

    distanceMatrix.push(distances);
  }

  return distanceMatrix;
};

// find nearest next point
export const findNearestPoint = (
  currentPosition: number,
  visitedPoints: Array<number>,
  distanceMatrix: Array<Array<number>>
) => {
  let nextPoint = currentPosition;

  // launch a loop for each coordinate
  for (let i = 0; i < distanceMatrix.length; i++) {
    // exclude visited coordinates
    if (visitedPoints.includes(i)) {
      continue;
    }

    // set next point if distance to the current point is minimal
    if (
      distanceMatrix[currentPosition][i] <
      distanceMatrix[currentPosition][nextPoint]
    ) {
      nextPoint = i;
    }
  }

  return nextPoint;
};

// make a route like NDNEED
export const makeRoute = (
  visitedPoints: Array<number>,
  coordinates: Array<Array<number>>,
  size: number
) => {
  let route = "";
  let renderRoute: Array<any> = [[0, size, "idle"]];
  let prevDirection = "";
  let prevBorder = "";

  // launch a loop for each coordinate
  for (let i = 1; i < visitedPoints.length; i++) {
    // calculate defference between x axis coordinates
    const differenceX =
      coordinates[visitedPoints[i]][0] - coordinates[visitedPoints[i - 1]][0];
    // calculate defference between y axis coordinates
    const differenceY =
      coordinates[visitedPoints[i]][1] - coordinates[visitedPoints[i - 1]][1];

    // if difference on x axis more than zero add E command and write route
    if (differenceX > 0) {
      // calculate if should shift cell on UI
      let shiftCell: number =
        prevBorder === BORDERS.RIGHT || prevDirection === ACTIONS.MOVE_EAST
          ? 1
          : 0;
      // choose border with direction
      if (![ACTIONS.MOVE_WEST, ACTIONS.MOVE_EAST].includes(prevDirection)) {
        prevBorder =
          prevDirection === ACTIONS.MOVE_NORTH ? BORDERS.TOP : BORDERS.BOTTOM;
      }
      // change direction
      prevDirection = ACTIONS.MOVE_EAST;
      // calculate current cell to add path on borders
      const currentPosition = [
        renderRoute.at(-1)[0] + shiftCell,
        renderRoute.at(-1)[1],
      ];
      for (let j = 0; j < differenceX; j++) {
        // add direction on each step
        route += ACTIONS.MOVE_EAST;
        // add current cell to render route array
        renderRoute = [
          ...renderRoute,
          [currentPosition[0] + j, currentPosition[1], prevBorder],
        ];
        shiftCell = 0;
      }
    }

    // same for other directions
    if (differenceX < 0) {
      let shiftCell: number =
        prevBorder === BORDERS.LEFT || prevDirection === ACTIONS.MOVE_WEST
          ? 1
          : 0;
      if (![ACTIONS.MOVE_WEST, ACTIONS.MOVE_EAST].includes(prevDirection)) {
        prevBorder =
          prevDirection === ACTIONS.MOVE_NORTH ? BORDERS.TOP : BORDERS.BOTTOM;
      }
      prevDirection = ACTIONS.MOVE_WEST;
      const currentPosition = [
        renderRoute.at(-1)[0] - shiftCell,
        renderRoute.at(-1)[1],
      ];
      for (let j = 0; j < Math.abs(differenceX); j++) {
        route += ACTIONS.MOVE_WEST;
        renderRoute = [
          ...renderRoute,
          [currentPosition[0] - j, currentPosition[1], prevBorder],
        ];
        shiftCell = 0;
      }
    }

    if (differenceY > 0) {
      let shiftCell: number =
        prevBorder === BORDERS.TOP || prevDirection === ACTIONS.MOVE_NORTH
          ? 1
          : 0;
      if (![ACTIONS.MOVE_NORTH, ACTIONS.MOVE_SOUTH].includes(prevDirection)) {
        prevBorder =
          prevDirection === ACTIONS.MOVE_EAST ? BORDERS.RIGHT : BORDERS.LEFT;
      }
      prevDirection = ACTIONS.MOVE_NORTH;
      const currentPosition = [
        renderRoute.at(-1)[0],
        renderRoute.at(-1)[1] - shiftCell,
      ];
      for (let j = 0; j < differenceY; j++) {
        route += ACTIONS.MOVE_NORTH;
        renderRoute = [
          ...renderRoute,
          [currentPosition[0], currentPosition[1] - j, prevBorder],
        ];
      }
    }
    if (differenceY < 0) {
      let shiftCell: number =
        prevBorder === BORDERS.BOTTOM || prevDirection === ACTIONS.MOVE_SOUTH
          ? 1
          : 0;
      if (![ACTIONS.MOVE_NORTH, ACTIONS.MOVE_SOUTH].includes(prevDirection)) {
        prevBorder =
          prevDirection === ACTIONS.MOVE_EAST ? BORDERS.RIGHT : BORDERS.LEFT;
      }
      prevDirection = ACTIONS.MOVE_SOUTH;
      const currentPosition = [
        renderRoute.at(-1)[0],
        renderRoute.at(-1)[1] + shiftCell,
      ];
      for (let j = 0; j < Math.abs(differenceY); j++) {
        route += ACTIONS.MOVE_SOUTH;
        renderRoute = [
          ...renderRoute,
          [currentPosition[0], currentPosition[1] + j, prevBorder],
        ];
        shiftCell = 0;
      }
    }
    // add drop pizza command
    route += ACTIONS.DROP_PIZZA;
  }
  renderRoute.shift();
  return [route, renderRoute] as const;
};

// build string of commands like NDNEED
export const buildPath = (
  distanceMatrix: Array<Array<number>>,
  coordinates: Array<Array<number>>,
  size: number
) => {
  // set that (0, 0) is already visited
  const visitedPoints = [0];

  // launch a loop for each coordinate
  for (let i = 0; i < distanceMatrix.length - 1; i++) {
    // find nearest next point
    const nearestPoint = findNearestPoint(
      visitedPoints[i],
      visitedPoints,
      distanceMatrix
    );
    visitedPoints.push(nearestPoint);
  }

  // make a route like NDNEED
  return makeRoute(visitedPoints, coordinates, size);
};
