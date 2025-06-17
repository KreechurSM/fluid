class WhiteNoise {
  constructor(seed = 0) {
    this.seed = seed;
  }

  noise(x, y, z) {
    // Deterministic pseudo-random based on coordinates and seed
    let n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + this.seed * 43758.5453) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }
}

export default WhiteNoise;
