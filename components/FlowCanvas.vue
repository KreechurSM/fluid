<template>
  <div class="relative w-full flex justify-center">
    <div class="aspect-square w-full max-w-[600px] rounded-lg flex items-center justify-center">
      <!-- Burst effect overlay (behind canvas) -->
      <span
        v-if="highlight"
        class="canvas-burst"
        :style="burstStyle"
        @animationend="highlight = false"
      ></span>
      <canvas
        ref="canvasRef"
        class="w-full h-full rounded-lg block"
        style="position: relative; z-index: 2;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { hexToHSL, lerp } from '@/composables/useColor.js'
import PerlinNoise from '@/utils/PerlinNoise.js'
import ManhattanNoise from '@/utils/ManhattanNoise.js'
import SimplexNoise from '@/utils/SimplexNoise.js'
import WorleyNoise from '@/utils/WorleyNoise.js'
import WhiteNoise from '@/utils/WhiteNoise.js'
import FractionalBrownianNoise from '@/utils/FractionalBrownianNoise.js'
import { useSettingsStore } from '~/store/settings'

const settingsStore = useSettingsStore();

// No longer need props for settings, they will be accessed from the store directly
// const props = defineProps(['isPaused']) // Only if isPaused is still passed as a prop
const emit = defineEmits(['toggle-pause'])

const canvasRef = ref(null)
const highlight = ref(false)
const burstSize = ref(0)

let animationFrameId = null
let mouseX = null
let mouseY = null
let time = 0
let noiseGen

function getDotColor(baseY, canvasHeight) {
  if (settingsStore.colorMode === 'solid') {
    return settingsStore.solidColor
  } else {
    const startHSL = hexToHSL(settingsStore.gradientStart)
    const endHSL = hexToHSL(settingsStore.gradientEnd)
    const t = baseY / canvasHeight
    const currentH = lerp(startHSL.h, endHSL.h, t)
    const currentS = lerp(startHSL.s, endHSL.s, t)
    const currentL = lerp(startHSL.l, endHSL.l, t)
    return `hsl(${currentH}, ${currentS}%, ${currentL}%)`
  }
}

function draw() {
  // Cancel any previous animation frame to prevent multiple loops
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const gridPixelSize = canvas.width * Number(settingsStore.size)
  const gridCount = Number(settingsStore.dimensions) || 88
  const cols = gridCount
  const rows = gridCount
  const spacingX = gridPixelSize / cols
  const spacingY = gridPixelSize / rows
  const offsetX = (canvas.width - gridPixelSize) / 2
  const offsetY = (canvas.height - gridPixelSize) / 2

  const perlinScale = Number(settingsStore.waves) || 0.1
  const perlinAmplitude = Number(settingsStore.amplitude) || 20
  const perlinSpeed = Number(settingsStore.frequency) || 0.002
  const maxDisplacementForSize = Number(settingsStore.maxDisplacement) || 40
  const repelRadius = Number(settingsStore.repelEnabled) ? Number(settingsStore.repelRadius) || 75 : 0
  const repelStrength = Number(settingsStore.repelEnabled) ? Number(settingsStore.repelStrength) || 15 : 0

  const minDotSize = Number(settingsStore.dotMin)
  const maxDotSize = Number(settingsStore.dotMax)

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const baseX = offsetX + i * spacingX + spacingX / 2
      const baseY = offsetY + j * spacingY + spacingY / 2

      const noiseX = noiseGen.noise(i * perlinScale, j * perlinScale, time * perlinSpeed)
      const noiseY = noiseGen.noise(i * perlinScale + 100, j * perlinScale + 100, time * perlinSpeed + 100)
      const offsetDotX = noiseX * perlinAmplitude
      const offsetDotY = noiseY * perlinAmplitude

      let finalX = baseX + offsetDotX
      let finalY = baseY + offsetDotY

      if (mouseX !== null && mouseY !== null) {
        const dx = finalX - mouseX
        const dy = finalY - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < repelRadius) {
          const angle = Math.atan2(dy, dx)
          const force = (repelRadius - distance) / repelRadius * repelStrength
          finalX += Math.cos(angle) * force
          finalY += Math.sin(angle) * force
        }
      }

      const totalDisplacementX = finalX - baseX
      const totalDisplacementY = finalY - baseY
      const displacementMagnitude = Math.sqrt(totalDisplacementX * totalDisplacementX + totalDisplacementY * totalDisplacementY)

      let currentDotSize = minDotSize
      if (displacementMagnitude > 0) {
        const sizeT = Math.min(1, displacementMagnitude / maxDisplacementForSize)
        currentDotSize = lerp(minDotSize, maxDotSize, sizeT)
      }
      currentDotSize = Math.max(minDotSize, currentDotSize)

      ctx.fillStyle = getDotColor(baseY, canvas.height)
      ctx.beginPath()
      ctx.arc(finalX, finalY, currentDotSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    }
  }
  time++
  if (!settingsStore.isPaused) {
    animationFrameId = requestAnimationFrame(draw)
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const parent = canvas.parentElement
  const size = Math.min(parent.offsetWidth, parent.offsetHeight)
  canvas.width = size
  canvas.height = size
  draw()
}

function handleMouseMove(event) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  mouseX = event.clientX - rect.left
  mouseY = event.clientY - rect.top
}

onMounted(() => {
  createNoise()
  window.addEventListener('resize', resizeCanvas)
  canvasRef.value.addEventListener('mousemove', handleMouseMove)
  resizeCanvas()
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
  }
  cancelAnimationFrame(animationFrameId)
})

// Optional: If you want to react to pause/play from parent
watch(() => settingsStore.isPaused, (paused) => {
  if (!paused) draw()
  else cancelAnimationFrame(animationFrameId)
})

watch(() => settingsStore.noiseType, () => {
  createNoise()
  draw()
})

function exportPNG() {
  const canvas = canvasRef.value
  const link = document.createElement('a')
  link.download = 'flow.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// SVG export (rasterizes canvas as SVG image)
function exportSVG() {
  const canvas = canvasRef.value
  const imgData = canvas.toDataURL('image/png')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
      <image href="${imgData}" width="${canvas.width}" height="${canvas.height}"/>
    </svg>
  `
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = 'flow.svg'
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

function randomizeNoise() {
  createNoise()
  draw()
}

function createNoise() {
  const noiseTypes = {
    perlin: PerlinNoise,
    manhattan: ManhattanNoise,
    simplex: SimplexNoise,
    worley: WorleyNoise,
    white: WhiteNoise,
    fbm: FractionalBrownianNoise, // Add this line
  }
  const NoiseClass = noiseTypes[settingsStore.noiseType] || PerlinNoise // Default to PerlinNoise
  noiseGen = new NoiseClass()
}

function triggerHighlight() {
  highlight.value = false
  // Force reflow to restart animation if needed
  void document.body.offsetWidth
  highlight.value = true
}

// Watch for settings changes that affect the canvas
watch(
  [
    () => settingsStore.dotMin,
    () => settingsStore.dotMax,
    () => settingsStore.amplitude,
    () => settingsStore.waves,
    () => settingsStore.frequency,
    () => settingsStore.repelEnabled,
    () => settingsStore.repelRadius,
    () => settingsStore.repelStrength,
    () => settingsStore.maxDisplacement,
    () => settingsStore.noiseType,
    () => settingsStore.dimensions,
    () => settingsStore.size,
    () => settingsStore.colorMode,
    () => settingsStore.solidColor,
    () => settingsStore.gradientStart,
    () => settingsStore.gradientEnd,
  ],
  () => {
    triggerHighlight()
  }
)

function updateBurstSize() {
  nextTick(() => {
    if (canvasRef.value) {
      burstSize.value = canvasRef.value.width
    }
  })
}

onMounted(() => {
  updateBurstSize()
  window.addEventListener('resize', updateBurstSize)
  canvasRef.value.addEventListener('mousemove', handleMouseMove)
  resizeCanvas()
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBurstSize)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
  }
  cancelAnimationFrame(animationFrameId)
})

watch(
  [
    () => settingsStore.size,
    () => settingsStore.dimensions,
  ],
  updateBurstSize
)

const burstStyle = computed(() => ({
  width: burstSize.value + 'px',
  height: burstSize.value + 'px',
}))

defineExpose({ exportPNG, exportSVG, randomizeNoise })
</script>

<style scoped>
.canvas-burst {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.2);
  z-index: 1; /* Behind the canvas */
  background: radial-gradient(circle, rgba(81,162,255,0.22) 0%, rgba(81,162,255,0.10) 60%, rgba(81,162,255,0.0) 100%);
  animation: burstCircle 0.6s cubic-bezier(0.4,0,0.2,1);
}

@keyframes burstCircle {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.7;
    filter: blur(2px);
  }
  40% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 0.5;
    filter: blur(8px);
  }
  70% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.25;
    filter: blur(16px);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
    filter: blur(24px);
  }
}
</style>