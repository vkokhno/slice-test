import {
  getDistanceMatrix,
  findNearestPoint,
  makeRoute,
} from "../generatePath";

describe("Get distances between each point", () => {
  it("should return correct result", () => {
    const firstPoint = [1, 3];
    const secondPoint = [4, 4];
    const coordinates = [firstPoint, secondPoint];

    expect(getDistanceMatrix(coordinates)).toEqual([
      [Infinity, 4],
      [4, Infinity],
    ]);
  });
});

describe("Find nearest point", () => {
  it("should return correct result", () => {
    const currentPosition = 1;
    const visitedPoints = [0, 1];
    const distanceMatrix = [
      [Infinity, 4, 8],
      [4, Infinity, 4],
      [8, 4, Infinity],
    ];

    expect(
      findNearestPoint(currentPosition, visitedPoints, distanceMatrix)
    ).toEqual(2);
  });
});

describe("Make route", () => {
  it("should return correct result", () => {
    const path = [0, 1, 2];
    const coordinates = [
      [0, 0],
      [1, 3],
      [4, 4],
    ];

    expect(makeRoute(path, coordinates, 5)[0]).toEqual("ENNNDEEEND");
  });
});
