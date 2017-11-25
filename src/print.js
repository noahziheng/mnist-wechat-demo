class Print {
  constructor () {
    this.canvas = document.getElementById('main')
    this.input = document.getElementById('input')
    this.canvas.width = 336 // 12 * 28 + 1
    this.canvas.height = 336 // 12 * 28 + 1
    this.ctx = this.canvas.getContext('2d')
    this.bindListeners()
    this.initialize()
  }

  bindListeners () {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false)
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false)
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false)
    document.body.addEventListener('touchstart', this.preventBodyMove.bind(this), false)
    document.body.addEventListener('touchend', this.preventBodyMove.bind(this), false)
    document.body.addEventListener('touchmove', this.preventBodyMove.bind(this), false)
  }

  initialize () {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fillRect(0, 0, 336, 336)
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(0, 0, 336, 336)
    this.ctx.lineWidth = 0.05
    for (let i = 0; i < 27; i++) {
      this.ctx.beginPath()
      this.ctx.moveTo((i + 1) * 12, 0)
      this.ctx.lineTo((i + 1) * 12, 336)
      this.ctx.closePath()
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.moveTo(0, (i + 1) * 12)
      this.ctx.lineTo(336, (i + 1) * 12)
      this.ctx.closePath()
      this.ctx.stroke()
    }
    this.drawInput()
  }

  preventBodyMove (e) {
    if (e.target === this.canvas) {
      e.preventDefault()
    }
  }

  onMouseDown (e) {
    this.canvas.style.cursor = 'crosshair'
    this.drawing = true
    this.prev = this.getPosition(e.clientX, e.clientY)
  }

  onMouseUp () {
    this.drawing = false
    this.drawInput()
  }

  onMouseMove (e) {
    if (this.drawing) {
      let curr = this.getPosition(e.clientX, e.clientY)
      this.ctx.lineWidth = 12
      this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      this.ctx.moveTo(this.prev.x, this.prev.y)
      this.ctx.lineTo(curr.x, curr.y)
      this.ctx.stroke()
      this.ctx.closePath()
      this.prev = curr
    }
  }

  getPosition (clientX, clientY) {
    let rect = this.canvas.getBoundingClientRect()
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  onTouchStart (e) {
    let touch = e.touches[0]
    let mouseEvent = new window.MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
    this.canvas.dispatchEvent(mouseEvent)
  }

  onTouchEnd () {
    let mouseEvent = new window.MouseEvent('mouseup', {})
    this.canvas.dispatchEvent(mouseEvent)
  }

  onTouchMove (e) {
    let touch = e.touches[0]
    let mouseEvent = new window.MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
    this.canvas.dispatchEvent(mouseEvent)
  }

  drawInput () {
    let ctx = this.input.getContext('2d')
    let img = new window.Image()
    img.onload = () => {
      let inputs = []
      let small = document.createElement('canvas').getContext('2d')
      small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28)
      let data = small.getImageData(0, 0, 28, 28).data
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          let n = 4 * (i * 28 + j)
          inputs[i * 28 + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3
          ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')'
          ctx.fillRect(j * 5, i * 5, 5, 5)
        }
      }
      if (Math.min(...inputs) === 255) {
        return
      }

      window.fetch('/api/mnist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      }).then(response => {
        return response.text()
      }).then(body => {
        const data = JSON.parse(body)
        let maxIndex = []
        for (let i = 0; i < 2; i++) {
          let max = 0
          for (let j = 0; j < 10; j++) {
            let value = Math.round(data.results[i][j] * 1000)
            if (value > max) {
              max = value
              maxIndex[i] = j
            }
          }
        }
        document.getElementById('output').innerHTML = `回归分析：${maxIndex[0]}  卷积网络：${maxIndex[1]}`
      })
    }
    img.src = this.canvas.toDataURL()
  }
}

export default Print
