// http://www.swiper.com.cn/usage/animate/index.html
export default {
  animate(swiper, once = false) {
		!once && this.clear()
    let aniElements = swiper.slides[swiper.activeIndex].querySelectorAll('.ani')
    Array.prototype.forEach.call(aniElements, (elem) => {
      elem.style.visibility = 'visible'

      let animated = elem.attributes['animated'] ? elem.attributes['animated'] : ''
      if(once && animated){
        return true
      }

      let style = elem.attributes['style'].value
      let effect = elem.attributes['ani-effect'] ? elem.attributes['ani-effect'].value : ''
      let duration = elem.attributes['ani-duration'] ? elem.attributes['ani-duration'].value : ''
      let delay = elem.attributes['ani-delay'] ? elem.attributes['ani-delay'].value : ''

      duration && (style = style + ';animation-duration:' + duration + ';-webkit-animation-duration:' + duration)
      delay && (style = style + ';animation-delay:' + delay + ';-webkit-animation-delay:' + delay)

      elem.className += ' ' + effect + ' animated'
      elem.setAttribute('style', style)
      elem.setAttribute('animated', true)
    })
  },
  cache() {
    let aniElements = window.document.documentElement.querySelectorAll('.ani')
    Array.prototype.forEach.call(aniElements, (elem) => {
      elem.attributes['style'] ?
        elem.setAttribute('ani-style-cache', elem.attributes['style'].value) :
        elem.setAttribute('ani-style-cache', ' '), elem.style.visibility = 'hidden'
    })
  },
  clear() {
    let aniElements = window.document.documentElement.querySelectorAll('.ani')
    Array.prototype.forEach.call(aniElements, (elem) => {
      elem.attributes['ani-style-cache'] && elem.setAttribute('style', elem.attributes['ani-style-cache'].value)
      elem.style.visibility = 'hidden'
      elem.className = elem.className.replace(' animated', '')
      let effect = elem.attributes['ani-effect'] ? ' ' + elem.attributes['ani-effect'].value : ''
      elem.className = elem.className.replace(effect, '')
    })
  }
}
