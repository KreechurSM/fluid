<template>
  <div class="relative w-full flex justify-center">
    <div class="aspect-square w-full max-w-[600px] rounded-lg flex items-center justify-center">
      <canvas
        ref="canvasRef"
        class="w-full h-full rounded-lg block"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineExpose } from 'vue'
import PerlinNoise from '@/utils/PerlinNoise.js'
import ManhattanNoise from '@/utils/ManhattanNoise.js'
import SimplexNoise from '@/utils/SimplexNoise.js'

const props = defineProps([
  'proportion', 'size',
  'colorMode', 'solidColor', 'gradientStart', 'gradientEnd',
  'dotMin', 'dotMax', 'amplitude', 'waves', 'frequency', 'repelEnabled', 'repelRadius', 'repelStrength', 'maxDisplacement',
  'isPaused',
  'noiseType'
])
const emit = defineEmits(['toggle-pause'])

const canvasRef = ref(null)

let animationFrameId = null
let mouseX = null
let mouseY = null
let time = 0
let noiseGen

function lerp(a, b, t) {
  return a + (b - a) * t
}

function hexToHSL(hex) {
  let r = 0, g = 0, b = 0
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255
    g = parseInt(hex.slice(3, 5), 16) / 255
    b = parseInt(hex.slice(5, 7), 16) / 255
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function getDotColor(baseY, canvasHeight) {
  if (props.colorMode === 'solid') {
    return props.solidColor
  } else {
    const startHSL = hexToHSL(props.gradientStart)
    const endHSL = hexToHSL(props.gradientEnd)
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

  const gridPixelSize = canvas.width * Number(props.size)
  const gridCount = Number(props.proportion) || 88
  const cols = gridCount
  const rows = gridCount
  const spacingX = gridPixelSize / cols
  const spacingY = gridPixelSize / rows
  const offsetX = (canvas.width - gridPixelSize) / 2
  const offsetY = (canvas.height - gridPixelSize) / 2

  const perlinScale = Number(props.waves) || 0.1
  const perlinAmplitude = Number(props.amplitude) || 20
  const perlinSpeed = Number(props.frequency) || 0.002
  const maxDisplacementForSize = Number(props.maxDisplacement) || 40
  const repelRadius = Number(props.repelEnabled) ? Number(props.repelRadius) || 75 : 0
  const repelStrength = Number(props.repelEnabled) ? Number(props.repelStrength) || 15 : 0

  const minDotSize = Number(props.dotMin)
  const maxDotSize = Number(props.dotMax)

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
  if (!props.isPaused) {
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
watch(() => props.isPaused, (paused) => {
  if (!paused) draw()
  else cancelAnimationFrame(animationFrameId)
})

watch(() => props.noiseType, () => {
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
  if (props.noiseType === 'manhattan') {
    noiseGen = new ManhattanNoise()
  } else if (props.noiseType === 'simplex') {
    noiseGen = new SimplexNoise()
  } else {
    noiseGen = new PerlinNoise()
  }
}

defineExpose({ exportPNG, exportSVG, randomizeNoise })
</script>