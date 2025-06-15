import {createNoise2D, createNoise3D} from 'simplex-noise'

class SimplexNoise {
  constructor(seed) {
    this.noise2D = createNoise2D();
    this.noise3D = createNoise3D();
  }
  noise(x, y, z = 0) {
    if (z !== 0) {
      return (this.noise3D(x, y, z) + 1) / 2
    } else {
      return (this.noise2D(x, y) + 1) / 2
    }
  }
}
export default SimplexNoise
