/**
 * 主題管理服務
 * 支援淺色/深色模式切換，並提供系統偏好跟隨功能
 */

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  actualTheme: 'light' | 'dark';
}

const STORAGE_KEY = 'theme-preference';

class ThemeService {
  private state: ThemeState = {
    mode: 'system',
    actualTheme: 'light'
  };
  
  private listeners: Array<(state: ThemeState) => void> = [];
  private mediaQuery: MediaQueryList | null = null;
  
  constructor() {
    this.init();
  }
  
  /**
   * 初始化主題服務
   */
  private init(): void {
    // 從本地存儲讀取用戶偏好
    const savedMode = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      this.state.mode = savedMode;
    }
    
    // 設置媒體查詢監聽器
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
    
    // 應用初始主題
    this.applyTheme();
  }
  
  /**
   * 處理系統主題變化
   */
  private handleSystemThemeChange(e: MediaQueryListEvent): void {
    if (this.state.mode === 'system') {
      this.state.actualTheme = e.matches ? 'dark' : 'light';
      this.updateDOM();
      this.notifyListeners();
    }
  }
  
  /**
   * 獲取當前系統偏好
   */
  private getSystemPreference(): 'light' | 'dark' {
    if (this.mediaQuery) {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  /**
   * 計算實際主題
   */
  private calculateActualTheme(): 'light' | 'dark' {
    if (this.state.mode === 'system') {
      return this.getSystemPreference();
    }
    return this.state.mode;
  }
  
  /**
   * 應用主題到 DOM
   */
  private applyTheme(): void {
    this.state.actualTheme = this.calculateActualTheme();
    this.updateDOM();
  }
  
  /**
   * 更新 DOM 類名
   */
  private updateDOM(): void {
    const root = document.documentElement;
    
    // 添加過渡類
    root.classList.add('theme-transition');
    
    // 移除舊類
    root.classList.remove('light-mode', 'dark-mode');
    
    // 添加新類
    if (this.state.actualTheme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.add('light-mode');
    }
    
    // 更新 meta 標籤 (針對移動端瀏覽器)
    this.updateMetaThemeColor();
    
    // 延遲移除過渡類
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);
  }
  
  /**
   * 更新瀏覽器主題色 meta 標籤
   */
  private updateMetaThemeColor(): void {
    let metaTag = document.querySelector('meta[name="theme-color"]');
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTag);
    }
    
    const color = this.state.actualTheme === 'dark' ? '#1a1a2e' : '#FDF8F3';
    metaTag.setAttribute('content', color);
  }
  
  /**
   * 通知所有監聽器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  /**
   * 設置主題模式
   */
  setMode(mode: ThemeMode): void {
    if (this.state.mode === mode) return;
    
    this.state.mode = mode;
    localStorage.setItem(STORAGE_KEY, mode);
    this.applyTheme();
    this.notifyListeners();
  }
  
  /**
   * 切換主題 (淺色 <-> 深色)
   */
  toggle(): void {
    const newMode = this.state.actualTheme === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }
  
  /**
   * 循環切換主題 (淺色 -> 深色 -> 系統 -> 淺色)
   */
  cycle(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(this.state.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex] ?? 'light';
    this.setMode(nextMode);
  }
  
  /**
   * 獲取當前狀態
   */
  getState(): ThemeState {
    return { ...this.state };
  }
  
  /**
   * 獲取當前模式
   */
  getMode(): ThemeMode {
    return this.state.mode;
  }
  
  /**
   * 獲取實際顯示的主題
   */
  getActualTheme(): 'light' | 'dark' {
    return this.state.actualTheme;
  }
  
  /**
   * 檢查是否為深色模式
   */
  isDark(): boolean {
    return this.state.actualTheme === 'dark';
  }
  
  /**
   * 訂閱主題變化
   */
  subscribe(listener: (state: ThemeState) => void): () => void {
    this.listeners.push(listener);
    
    // 立即調用一次傳遞當前狀態
    listener({ ...this.state });
    
    // 返回取消訂閱函數
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * 清理資源
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this));
    }
    this.listeners = [];
  }
}

// 導出單例
export const themeService = new ThemeService();

// Vue 3 Composable
export function useTheme() {
  return {
    getMode: () => themeService.getMode(),
    getActualTheme: () => themeService.getActualTheme(),
    isDark: () => themeService.isDark(),
    setMode: (mode: ThemeMode) => themeService.setMode(mode),
    toggle: () => themeService.toggle(),
    cycle: () => themeService.cycle(),
    subscribe: (listener: (state: ThemeState) => void) => themeService.subscribe(listener)
  };
}
