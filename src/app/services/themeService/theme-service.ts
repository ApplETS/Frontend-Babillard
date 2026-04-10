import { Injectable, inject, Renderer2, effect, signal, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private rendererFactory = inject(RendererFactory2);
  private document = inject(DOCUMENT);

  private renderer: Renderer2;
  private root: HTMLElement;
  // local storage will be replaced with use account persistence later on
  private persistent_theme = localStorage.getItem('theme');
  isDark = signal(this.persistent_theme === 'dark');
  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.root = this.document.documentElement;

    effect(() => {
      const currentTheme = this.isDark() ? 'dark' : 'light';
      if (currentTheme) this.renderer.setAttribute(this.root, 'data-theme', currentTheme);
      if (currentTheme === "dark") {
        this.renderer.addClass(this.root, 'dark');
      } else {
        this.renderer.removeClass(this.root, 'dark');
      }
      localStorage.setItem('theme', currentTheme);
    });
  }
}
