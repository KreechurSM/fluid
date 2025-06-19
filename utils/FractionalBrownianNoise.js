// utils/FractionalBrownianNoise.js
class FractionalBrownianNoise {
    constructor() {
        this.NUM_OCTAVES = 5;
        // Pre-calculate rotation matrix components
        const rotationAngle = 0.5;
        this.cosAngle = Math.cos(rotationAngle);
        this.sinAngle = Math.sin(rotationAngle);
    }

    random(_st) { // _st is expected to be an object like { x: someValue, y: someValue }
        const dotProduct = _st.x * 12.9898 + _st.y * 78.233;
        const sinValue = Math.sin(dotProduct);
        const scaledValue = sinValue * 43758.5453123;
        return scaledValue - Math.floor(scaledValue); // JavaScript equivalent of fract()
    }

    // Helper for fract that works on vector-like objects {x, y}
    _fractVec2(_vec) {
        return {
            x: _vec.x - Math.floor(_vec.x),
            y: _vec.y - Math.floor(_vec.y)
        };
    }

    // Helper for mix (linear interpolation)
    _mix(val1, val2, t) {
        return val1 * (1 - t) + val2 * t;
    }

    _noise(_st) { // Internal Perlin-like noise
        const i = { x: Math.floor(_st.x), y: Math.floor(_st.y) };
        const f = this._fractVec2(_st);

        // Four corners in 2D of a tile
        const a = this.random(i);
        const b = this.random({ x: i.x + 1.0, y: i.y + 0.0 });
        const c = this.random({ x: i.x + 0.0, y: i.y + 1.0 });
        const d = this.random({ x: i.x + 1.0, y: i.y + 1.0 });

        // Smoothstep curve: t * t * (3.0 - 2.0 * t)
        const u = {
            x: f.x * f.x * (3.0 - 2.0 * f.x),
            y: f.y * f.y * (3.0 - 2.0 * f.y)
        };

        // Interpolate
        return this._mix(a, b, u.x) +
               (c - a) * u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
    }

    // Main FBM noise method
    // Accepts x, y, z to be compatible with other noise generators, but z is currently ignored.
    noise(x, y, z) {
        let _st = { x: x, y: y }; // Work with 2D coordinates for FBM logic

        let v = 0.0;
        let a = 0.5;
        const shift = { x: 100.0, y: 100.0 };

        // Rotation matrix: mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5))
        // Becomes:
        // x' = x * cosAngle - y * sinAngle
        // y' = x * sinAngle + y * cosAngle

        for (let i = 0; i < this.NUM_OCTAVES; ++i) {
            v += a * this._noise(_st); // Call the internal Perlin-like noise

            // Apply rotation: rot * _st
            let rotatedX = _st.x * this.cosAngle - _st.y * this.sinAngle;
            let rotatedY = _st.x * this.sinAngle + _st.y * this.cosAngle;

            // Apply scaling and shift: rotated * 2.0 + shift
            _st.x = rotatedX * 2.0 + shift.x;
            _st.y = rotatedY * 2.0 + shift.y;

            a *= 0.5;
        }
        return v;
    }
}

export default FractionalBrownianNoise;
