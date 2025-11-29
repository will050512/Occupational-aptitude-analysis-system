/**
 * Vue 3 自定義指令集
 */
import type { App, Directive } from 'vue';

/**
 * v-click-outside 指令
 * 用於檢測點擊元素外部
 */
const clickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      // 檢查點擊是否在元素外部
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    
    document.addEventListener('click', el._clickOutsideHandler);
    document.addEventListener('touchstart', el._clickOutsideHandler);
  },
  
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler);
    document.removeEventListener('touchstart', el._clickOutsideHandler);
    delete el._clickOutsideHandler;
  }
};

/**
 * v-focus 指令
 * 自動聚焦元素
 */
const focus: Directive = {
  mounted(el) {
    el.focus();
  }
};

/**
 * v-scroll-to 指令
 * 平滑滾動到元素
 */
const scrollTo: Directive = {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      const target = document.querySelector(binding.value);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
};

/**
 * 註冊所有指令
 */
export function registerDirectives(app: App): void {
  app.directive('click-outside', clickOutside);
  app.directive('focus', focus);
  app.directive('scroll-to', scrollTo);
}

export { clickOutside, focus, scrollTo };
