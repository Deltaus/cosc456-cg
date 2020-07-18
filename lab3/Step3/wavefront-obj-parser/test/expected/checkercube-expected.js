// We trim trailing `0` on floats
module.exports = {
  vertexNormals: [
    0, -1, 0,
    0, 1, 0,
    1, 0, 0,
    -0, -0, 1,
    -1, -0, -0,
    0, 0, -1
  ],
  vertexUVs: [
    0, 0.666667,
    0.333333, 0.666667,
    0.333333, 1,
    0, 1,
    0.666667, 0.333333,
    0.666667, 0.666667,
    0.333333, 0.333333,
    0.333333, 0,
    0.666667, 0,
    0, 0.333333,
    0, 0,
    1, 0.333333,
    1, 0
  ],
  vertexPositions: [
    1, -1, -1,
    1, -1, 1,
    -1, -1, 1,
    -1, -1, -1,
    1, 1, -0.999999,
    0.999999, 1, 1.000001,
    -1, 1, 1,
    -1, 1, -1
  ],
  vertexNormalIndices: [
    0, 0, 0, 0,
    1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5
  ],
  vertexUVIndices: [
    0, 1, 2, 3,
    4, 5, 1, 6,
    4, 6, 7, 8,
    9, 10, 7, 6,
    11, 4, 8, 12,
    9, 6, 1, 0
  ],
  vertexPositionIndices: [
    0, 1, 2, 3,
    4, 7, 6, 5,
    0, 4, 5, 1,
    1, 5, 6, 2,
    2, 6, 7, 3,
    4, 0, 3, 7
  ]
}