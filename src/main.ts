import modules from './modules'
import './styles/index.scss'

const jQueryRelayPromise = new Promise<void>(resolve => {
  const intervalKey = setInterval(() => {
    if (window.$ as any) {
      clearInterval(intervalKey)
      resolve()
    }
  })
})

const windowLoadedPromise = new Promise<void>(resolve => {
  window.addEventListener('load', () => resolve())
})

Promise.all([
  jQueryRelayPromise,
  // windowLoadedPromise
]).then(() => {
  modules.forEach(item => item())
  requestIdleCallback(() => moegirl.hooks.onLoaded?.())
  console.log('moegirlRenderer:initialized')
})

if (process.env.NODE_ENV === 'development') {
  moegirl.hooks.onLinkClicked = console.log
}







