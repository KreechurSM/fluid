class WorleyNoise {
  constructor(seed = Math.random()) {
    this.gridSize = 32; // Number of cells per axis
    this.featurePoints = [];
    this.seed = seed;
    this.initFeaturePoints();
  }

  // Simple seeded random (for reproducibility)
  random(x, y, z) {
    let s =
      Math.sin(
        x * 374761393 + y * 668265263 + z * 2147483647 + this.seed * 1e7
      ) * 43758.5453;
    return s - Math.floor(s);
  }

  initFeaturePoints() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        for (let z = 0; z < this.gridSize; z++) {
          // Each cell has one feature point at a random position within the cell
          this.featurePoints.push({
            x: x + this.random(x, y, z),
            y: y + this.random(y, x, z),
            z: z + this.random(z, x, y),
          });
        }
      }
    }
  }

  noise(x, y, z) {
    // Scale coordinates to grid
    const gx = x % this.gridSize;
    const gy = y % this.gridSize;
    const gz = z % this.gridSize;

    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const iz = Math.floor(gz);

    let minDist = Infinity;

    // Check neighboring cells (3x3x3 cube)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          let nx = (ix + dx + this.gridSize) % this.gridSize;
          let ny = (iy + dy + this.gridSize) % this.gridSize;
          let nz = (iz + dz + this.gridSize) % this.gridSize;
          let idx =
            nx * this.gridSize * this.gridSize + ny * this.gridSize + nz;
          let fp = this.featurePoints[idx];
          if (!fp) continue;
          let dist =
            Math.abs(gx - fp.x) + Math.abs(gy - fp.y) + Math.abs(gz - fp.z);
          if (dist < minDist) minDist = dist;
        }
      }
    }
    // Normalize distance to [0, 1] (max possible distance is sqrt(3))
    return minDist / 3;
  }
}

export default WorleyNoise;
