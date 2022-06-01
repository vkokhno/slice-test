import { getCoordinatesFromInputString } from "../index";

describe("Get coordinates from input string", () => {
  it("should return correct result", () => {
    const inputString = "5x5 (1, 3) (4, 4)";

    expect(getCoordinatesFromInputString(inputString)).toEqual([
      [5, 5],
      [
        [0, 0],
        [1, 3],
        [4, 4],
      ],
    ]);
  });
});
