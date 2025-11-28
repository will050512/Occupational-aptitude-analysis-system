import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Tailwind CSS 必須最先引入
import 'tailwindcss'

// 全域樣式
import './styles/theme.css'
import './styles/animations.css'
import './styles/illustrations.css'
import './styles/touch.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
