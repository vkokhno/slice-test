# Pizzabot (Challenged by slicelife)

## Description

This application is Pizzabot that returns a list of instructions for getting Pizzabot to the locations and delivering.

## Getting started

To run application you have to install [Node.js](https://nodejs.org/).

```shell
node -v
## v16.15.0
npm -v
## 8.11.0
```

## How to run

```shell
npm i
npm start

## Open http://localhost:3000 in your browser
```

## Аlgorithm

**1** User provides string of coordinates that contains places to delivery (5x5 (0, 0) (1, 3) (4, 4))

**2** String parse to array of coordinates like (getCoordinatesFromInputString) [[0, 0], [1, 3], [4, 4]]

**3** After that we create matrix of distances like (getDistanceMatrix):

|     | X1  | X2  | X3  |
| --- | --- | --- | --- |
| X1  | Inf | 4   | 8   |
| X2  | 4   | Inf | 2   |
| X3  | 8   | 4   | Inf |

**4**: To find a route we should find a nearest point to each other (findNearestPoint)

**5**: To make a string of commands from array of point we use makeRoute method

## Testing

To run test you should write:

```shell
npm i
npm test
```
