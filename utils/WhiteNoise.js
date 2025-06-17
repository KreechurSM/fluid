class WhiteNoise {
  constructor(seed) {
    // Seed might not be used for white noise, but included for consistency
    this.seed = seed;
  }

  noise(x, y, z) {
    // White noise returns a random value irrespective of coordinates
    return Math.random() * 2 - 1;
  }
}
