class ManhattanNoise {
  noise(x, y, z) {
    // Simple deterministic "noise" based on Manhattan distance and some trigonometry
    // You can replace this with a more sophisticated implementation if desired
    return (
      (Math.abs(Math.sin(x + y + z)) +
        Math.abs(Math.sin(x - y + z)) +
        Math.abs(Math.sin(x + y - z))) %
      1
    );
  }
}
export default ManhattanNoise;