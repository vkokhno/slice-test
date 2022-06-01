import React, { useState, useRef, useCallback } from "react";
import { Input, Button, Typography } from "antd";

import {
  getDistanceMatrix,
  buildPath,
  getCoordinatesFromInputString,
} from "./utils";

import "./App.css";
import "antd/dist/antd.css";

const { Text } = Typography;

function App() {
  const [matrixSize, setMatrixSize] = useState<Array<number>>([]);
  const [path, setPath] = useState<string>("");
  const [renderRoute, setRenderRoute] = useState<Array<Array<any>>>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<any>(null);

  // render map on UI
  const renderMap = useCallback(() => {
    const [x, y] = matrixSize;

    const map = new Array(x)
      .fill(null)
      .map((_, lineIndex) =>
        new Array(y)
          .fill(null)
          .map((_, cellIndex) => (
            <div key={`${lineIndex}${cellIndex}`} className="Cell" />
          ))
      );

    renderRoute.forEach((pos) => {
      map[pos[0]][pos[1]] = (
        <div
          {...map[pos[0]][pos[1]]?.props}
          key={`${pos[0]}${pos[1]}`}
          style={{
            ...map[pos[0]][pos[1]]?.props.style,
            [`border${pos[2]}Color`]: "red",
          }}
        />
      );
    });

    return (
      <div
        className="Grid"
        style={{
          gridTemplateColumns: `repeat(${x}, 1fr)`,
          gridTemplateRows: `${new Array(y).fill("1fr").join(" ")}`,
        }}
      >
        {map.map((line, lineIndex) => (
          <div key={lineIndex}>{line.map((cell) => cell)}</div>
        ))}
      </div>
    );
  }, [matrixSize, renderRoute]);

  // main method to calculate route
  const calculateRoute = useCallback(() => {
    // parse input string to get matrix size and array of coordinates
    const [matrixSize, coordinates] = getCoordinatesFromInputString(
      inputRef.current?.input?.value,
      setError
    );
    // if some error return
    if (!matrixSize || !coordinates) return;
    // set matrix size to render on UI
    setMatrixSize(matrixSize);

    // calculate matrix of distances
    const distanceMatrix = getDistanceMatrix(coordinates);

    // build a path
    const [path, renderRoute] = buildPath(
      distanceMatrix,
      coordinates,
      matrixSize[1] - 1
    );
    setPath(path);
    setRenderRoute(renderRoute);
  }, []);

  return (
    <div className="App">
      <Input.Group compact>
        <Input
          status={error && "error"}
          ref={inputRef}
          style={{ width: "calc(100% - 200px)" }}
          placeholder="Input string"
          onChange={() => setError("")}
        />
        <Button type="primary" onClick={calculateRoute}>
          Parse
        </Button>
      </Input.Group>
      <div className="Text">
        {error && <Text type="danger">{error}</Text>}
        <Text>Result: {path}</Text>
      </div>
      {renderMap()}
    </div>
  );
}

export default App;
