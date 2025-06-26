import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    dimensions: 88,
    size: 0.85,
    colorMode: 'gradient', // 'solid' or 'gradient'
    solidColor: '#ffffff',
    gradientStart: '#00d492',
    gradientEnd: '#51a2ff',
    dotMin: 0.3,
    dotMax: 4,
    amplitude: 20,
    waves: 0.1,
    frequency: 0.002,
    repelEnabled: false,
    repelRadius: 75,
    repelStrength: 15,
    maxDisplacement: 40,
    noiseType: 'perlin', // 'perlin', 'simplex', 'worley', 'manhattan', 'fractionalBrownian', 'white'
    isPaused: false,
  }),
  actions: {
    setDimensions(newDimensions) {
      this.dimensions = newDimensions;
    },
    setSize(newSize) {
      this.size = newSize;
    },
    setColorMode(newColorMode) {
      this.colorMode = newColorMode;
    },
    setSolidColor(newSolidColor) {
      this.solidColor = newSolidColor;
    },
    setGradientStart(newGradientStart) {
      this.gradientStart = newGradientStart;
    },
    setGradientEnd(newGradientEnd) {
      this.gradientEnd = newGradientEnd;
    },
    setDotMin(newDotMin) {
      this.dotMin = newDotMin;
    },
    setDotMax(newDotMax) {
      this.dotMax = newDotMax;
    },
    setAmplitude(newAmplitude) {
      this.amplitude = newAmplitude;
    },
    setWaves(newWaves) {
      this.waves = newWaves;
    },
    setFrequency(newFrequency) {
      this.frequency = newFrequency;
    },
    setRepelEnabled(enabled) {
      this.repelEnabled = enabled;
    },
    setRepelRadius(newRepelRadius) {
      this.repelRadius = newRepelRadius;
    },
    setRepelStrength(newRepelStrength) {
      this.repelStrength = newRepelStrength;
    },
    setMaxDisplacement(newMaxDisplacement) {
      this.maxDisplacement = newMaxDisplacement;
    },
    setNoiseType(newNoiseType) {
      this.noiseType = newNoiseType;
    },
    togglePause() {
      this.isPaused = !this.isPaused;
    },
    setIsPaused(paused) {
      this.isPaused = paused;
    },
    // Action to update all settings at once, useful for randomization or loading presets
    updateSettings(newSettings) {
      for (const key in newSettings) {
        if (this.hasOwnProperty(key)) {
          this[key] = newSettings[key];
        }
      }
    }
  },
});
