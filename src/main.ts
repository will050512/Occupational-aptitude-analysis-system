import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { StorageService } from './services/StorageService'
import { registerDirectives } from './directives'

// Tailwind CSS 必須最先引入
import 'tailwindcss'

// 全域樣式
import './styles/theme.css'
import './styles/animations.css'
import './styles/illustrations.css'
import './styles/touch.css'

// 初始化存儲服務（檢查版本並執行必要的清理）
const versionStrategy = StorageService.initialize()
if (versionStrategy !== 'none') {
  console.log(`[App] Version change handled: ${versionStrategy}`)
}

const app = createApp(App)

// 註冊自定義指令
registerDirectives(app)

app.use(router)

app.mount('#app')
