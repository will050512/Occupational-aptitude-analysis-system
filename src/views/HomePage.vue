<template>
  <div class="home-page">
    <!-- 開場動畫 -->
    <SplashScreen v-if="showSplash" @complete="onSplashComplete" />

    <!-- 主頁面內容 -->
    <div v-else class="home-content">
      <!-- 主題切換器 -->
      <div class="theme-toggle-wrapper">
        <ThemeToggle variant="full" size="md" />
      </div>
      
      <!-- 頂部裝飾 -->
      <div class="hero-decoration">
        <div class="cloud cloud-1 animate-floatSlow"></div>
        <div class="cloud cloud-small cloud-2 animate-float delay-300"></div>
        <div class="sun animate-pulse"></div>
      </div>

      <!-- 主視覺區 -->
      <header class="hero-section">
        <div class="city-skyline"></div>
        <div class="hero-content animate-fadeInUp">
          <h1 class="hero-title">
            <span class="title-main">新語市</span>
            <span class="title-sub">職涯探索</span>
          </h1>
          <p class="hero-description">
            在這座溫暖的城市裡，<br>
            透過一段互動旅程，<br>
            發現屬於你的職涯方向。
          </p>
        </div>
      </header>

      <!-- 開始按鈕區 -->
      <section class="cta-section">
        <button 
          class="btn btn-primary start-btn animate-fadeInUp delay-300"
          @click="startGame"
        >
          <span class="btn-icon">✨</span>
          <span>開始探索</span>
        </button>
        
        <!-- 繼續遊戲（如果有存檔） -->
        <button 
          v-if="hasSavedProgress"
          class="btn btn-secondary continue-btn animate-fadeInUp delay-400"
          @click="continueGame"
        >
          <span class="btn-icon">📖</span>
          <span>繼續旅程</span>
        </button>
      </section>

      <!-- 特色說明 -->
      <section class="features-section animate-fadeInUp delay-500">
        <div class="feature-card">
          <div class="feature-icon">🎭</div>
          <h3>互動敘事</h3>
          <p>透過故事選擇，而非填寫問卷</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔮</div>
          <h3>深度分析</h3>
          <p>16 種人格類型的專業剖析</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3>8-10 分鐘</h3>
          <p>一杯咖啡的時間，探索自我</p>
        </div>
      </section>

      <!-- 底部快速入口 -->
      <nav class="quick-links animate-fadeInUp delay-700">
        <router-link to="/gallery" class="quick-link">
          <span class="quick-link-icon">📚</span>
          <span class="quick-link-text">人格圖鑑</span>
        </router-link>
        <router-link to="/records" class="quick-link">
          <span class="quick-link-icon">📝</span>
          <span class="quick-link-text">我的紀錄</span>
        </router-link>
      </nav>

      <!-- 版本資訊 -->
      <footer class="app-footer">
        <div class="company-branding">
          <img src="@/logo/company-logo.png" alt="萬里遊科技" class="company-logo" />
        </div>
        <p class="company-info">萬里遊科技股份有限公司 © 2025</p>
        <p class="app-version">新語市職涯探索 v1.0</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SplashScreen from '@/components/SplashScreen.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { StorageService } from '@/services/StorageService'

const router = useRouter()
const showSplash = ref(true)
const hasSavedProgress = ref(false)

onMounted(() => {
  // 檢查是否有存檔
  hasSavedProgress.value = StorageService.hasSavedProgress()
  
  // 檢查是否已看過開場動畫
  const hasSeenSplash = StorageService.hasSeenSplash()
  if (hasSeenSplash) {
    showSplash.value = false
  }
})

const onSplashComplete = () => {
  showSplash.value = false
  StorageService.markSplashSeen()
}

const startGame = () => {
  // 開始新遊戲
  StorageService.clearCurrentProgress()
  router.push('/game')
}

const continueGame = () => {
  router.push('/game')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-primary);
  overflow-x: hidden;
}

.home-content {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  padding-bottom: var(--spacing-2xl);
  position: relative;
  max-width: 100%;
  margin: 0 auto;
}

/* 主題切換器定位 */
.theme-toggle-wrapper {
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 100;
}

@supports (padding-top: env(safe-area-inset-top)) {
  .theme-toggle-wrapper {
    top: calc(var(--spacing-md) + env(safe-area-inset-top));
    right: calc(var(--spacing-md) + env(safe-area-inset-right));
  }
}

/* 頂部裝飾 */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.cloud-1 {
  position: absolute;
  top: 30px;
  left: 10%;
  width: 80px;
  height: 30px;
  background: var(--color-overlay-light);
  border-radius: 20px;
}

.cloud-1::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--color-overlay-light);
  border-radius: 50%;
  top: -20px;
  left: 15px;
}

.cloud-2 {
  position: absolute;
  top: 60px;
  right: 15%;
  width: 60px;
  height: 24px;
  background: var(--color-overlay-medium);
  border-radius: 15px;
}

.cloud-2::before {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--color-overlay-medium);
  border-radius: 50%;
  top: -15px;
  left: 10px;
}

.hero-decoration .sun {
  position: absolute;
  top: 20px;
  right: 10%;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FFD93D, #FF9F43);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 217, 61, 0.5);
}

/* 主視覺區 */
.hero-section {
  position: relative;
  padding-top: 60px;
  text-align: center;
  z-index: 1;
  flex-shrink: 0;
}

.hero-section .city-skyline {
  position: absolute;
  bottom: -20px;
  left: -20px;
  right: -20px;
  height: 100px;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  margin-bottom: var(--spacing-lg);
}

.title-main {
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 10vw, 4rem);
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 2px 10px rgba(224, 123, 84, 0.2);
}

.title-sub {
  display: block;
  font-family: var(--font-sans);
  font-size: clamp(1rem, 4vw, 1.5rem);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.3em;
}

.hero-description {
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

/* CTA 區 - 響應式增強 */
.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin: var(--spacing-xl) 0;
  flex-shrink: 0;
}

.start-btn,
.continue-btn {
  width: 100%;
  max-width: 320px;
  min-height: 56px;
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
}

.start-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-inverse);
  border: none;
  box-shadow: 0 4px 20px rgba(224, 123, 84, 0.4);
}

/* 按鈕光暈動畫 */
.start-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-overlay-medium),
    transparent
  );
  transition: left 0.5s ease;
}

.start-btn:hover::before {
  left: 100%;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(224, 123, 84, 0.5);
}

.start-btn:active {
  transform: translateY(0) scale(0.98);
}

.continue-btn {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 2px solid var(--color-bg-tertiary);
}

.continue-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(224, 123, 84, 0.05);
}

.continue-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 1.25rem;
}

/* 特色說明 - 響應式網格 */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
  flex-shrink: 0;
}

.feature-card {
  text-align: center;
  padding: var(--spacing-md) var(--spacing-sm);
  background: var(--color-overlay-light);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  border: 1px solid transparent;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-4px);
  background: var(--color-overlay-heavy);
  border-color: var(--color-bg-tertiary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  margin-bottom: var(--spacing-sm);
  display: block;
}

.feature-card h3 {
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.feature-card p {
  font-size: clamp(0.7rem, 2vw, 0.875rem);
  color: var(--color-text-muted);
  line-height: var(--leading-normal);
}

/* 快速入口 - 響應式 */
.quick-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: auto;
  padding: var(--spacing-lg) 0;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
  padding: var(--spacing-md);
  min-width: 80px;
  border-radius: var(--radius-lg);
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  border: 2px solid transparent;
}

.quick-link:hover {
  color: var(--color-primary);
  background: var(--color-overlay-light);
  border-color: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.quick-link:active {
  transform: scale(0.95);
}

.quick-link-icon {
  font-size: 1.75rem;
}

.quick-link-text {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* 版本資訊 */
.app-footer {
  text-align: center;
  padding: var(--spacing-lg) 0;
  margin-top: var(--spacing-xl);
}

.company-branding {
  margin-bottom: var(--spacing-md);
}

.company-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.company-logo:hover {
  opacity: 1;
}

.company-info {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  margin: 0 0 4px 0;
}

.app-version {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  margin: 0;
}

/* 動畫 */
.animate-fadeInUp {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
.delay-700 { animation-delay: 0.7s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-floatSlow {
  animation: floatSlow 6s ease-in-out infinite;
}

.animate-float {
  animation: floatSlow 4s ease-in-out infinite;
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(5px); }
}

.animate-pulse {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

/* ========================================
   響應式調整 - 小手機 (≤375px)
   ======================================== */
@media (max-width: 375px) {
  .home-content {
    padding: var(--spacing-md);
  }
  
  .features-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .feature-card {
    display: flex;
    align-items: center;
    text-align: left;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .feature-icon {
    margin-bottom: 0;
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .feature-card h3,
  .feature-card p {
    text-align: left;
  }
}

/* ========================================
   響應式調整 - 平板 (≥480px)
   ======================================== */
@media (min-width: 480px) {
  .home-content {
    max-width: 500px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }
  
  .hero-section {
    padding-top: 80px;
  }
  
  .features-section {
    gap: var(--spacing-md);
  }
  
  .feature-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

/* ========================================
   響應式調整 - 大平板 (≥768px)
   ======================================== */
@media (min-width: 768px) {
  .home-content {
    max-width: 700px;
    padding: var(--spacing-2xl);
  }
  
  .hero-section {
    padding-top: 100px;
  }
  
  .hero-decoration {
    height: 250px;
  }
  
  .hero-decoration .sun {
    width: 60px;
    height: 60px;
  }
  
  .cta-section {
    flex-direction: row;
    justify-content: center;
    gap: var(--spacing-lg);
  }
  
  .start-btn,
  .continue-btn {
    width: auto;
    min-width: 220px;
    padding: var(--spacing-md) var(--spacing-2xl);
  }
  
  .features-section {
    gap: var(--spacing-lg);
  }
  
  .quick-links {
    gap: var(--spacing-2xl);
  }
  
  .quick-link {
    min-width: 100px;
    padding: var(--spacing-lg);
  }
  
  .quick-link-icon {
    font-size: 2rem;
  }
}

/* ========================================
   響應式調整 - 桌面 (≥1024px)
   ======================================== */
@media (min-width: 1024px) {
  .home-content {
    max-width: 900px;
    padding: var(--spacing-3xl);
  }
  
  .hero-section {
    padding-top: 120px;
  }
  
  .hero-decoration {
    height: 300px;
  }
  
  .hero-decoration .sun {
    width: 70px;
    height: 70px;
  }
  
  .cloud-1 {
    width: 100px;
    height: 40px;
  }
  
  .cloud-2 {
    width: 80px;
    height: 32px;
  }
  
  .features-section {
    gap: var(--spacing-xl);
  }
  
  .feature-card {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
  
  .quick-links {
    gap: var(--spacing-3xl);
  }
}

/* ========================================
   響應式調整 - 寬螢幕 (≥1280px)
   ======================================== */
@media (min-width: 1280px) {
  .home-content {
    max-width: 1000px;
  }
  
  .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .hero-description {
    max-width: 600px;
  }
}

/* ========================================
   橫向模式優化 (手機橫向)
   ======================================== */
@media (max-height: 500px) and (orientation: landscape) {
  .home-content {
    padding: var(--spacing-md);
  }
  
  .hero-section {
    padding-top: 40px;
  }
  
  .hero-decoration {
    height: 120px;
  }
  
  .hero-description {
    margin-bottom: var(--spacing-md);
  }
  
  .features-section {
    margin: var(--spacing-md) 0;
  }
  
  .quick-links {
    padding: var(--spacing-sm) 0;
  }
  
  .app-footer {
    padding: var(--spacing-sm) 0;
    margin-top: var(--spacing-md);
  }
}

/* 安全區域適配 (iPhone X+) */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .home-content {
    padding-bottom: calc(var(--spacing-2xl) + env(safe-area-inset-bottom));
  }
}

/* ========================================
   觸控設備優化
   ======================================== */
@media (hover: none) and (pointer: coarse) {
  .start-btn:hover::before {
    left: -100%;
  }
  
  .start-btn:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(224, 123, 84, 0.4);
  }
  
  .feature-card:hover {
    transform: none;
    background: var(--color-overlay-light);
  }
  
  .quick-link:hover {
    transform: none;
    background: transparent;
    border-color: transparent;
  }
  
  /* 觸控反饋 */
  .start-btn:active,
  .continue-btn:active {
    transform: scale(0.97);
    transition: transform 0.1s ease;
  }
  
  .feature-card:active {
    transform: scale(0.98);
    background: var(--color-overlay-heavy);
  }
  
  .quick-link:active {
    transform: scale(0.95);
    background: var(--color-bg-secondary);
  }
}
</style>
