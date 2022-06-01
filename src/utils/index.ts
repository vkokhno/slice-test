export * from "./generatePath";

// parse input string
export const getCoordinatesFromInputString = (
  inputString: string,
  setError: Function
) => {
  try {
    // check on empty string
    if (!inputString || inputString.length === 0) {
      throw "Please type input string";
    }

    const inputWithoutSpaces = inputString.replace(/\s/g, "");
    // regexp to find matrix size
    const matrixSizeRegExp = /([0-9]+x[0-9]+)/g;
    // regexp to find substr like (x, y)
    const coordinateRegExp = /\(([^)]+)\)/g;

    // parse input string to find matrix size
    const matrixSize =
      inputWithoutSpaces
        .match(matrixSizeRegExp)
        ?.map((size) => size.split("x").map((string) => Number(string)))[0] ??
      [];

    if (!matrixSize[0] || !matrixSize[1]) {
      throw "matrix size should be more than zero";
    }
    // parse input string to find array of coordinates
    const coordinates =
      inputString.match(coordinateRegExp)?.map((substring) => {
        const [x, y] = substring
          // cut brackets
          .slice(1, -1)
          // split to [x, y]
          .split(",")
          .map((string) => Number(string));

        if (x > matrixSize[0] || y > matrixSize[1] || x < 0 || y < 0) {
          throw "some points behind the matrix";
        }

        return [x, y];
      }) ?? [];
    // should add initial coordinate
    coordinates?.unshift([0, 0]);

    return [matrixSize, coordinates] as const;
  } catch (error) {
    setError(error);
    return [];
  }
};
