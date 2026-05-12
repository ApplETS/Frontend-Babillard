  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { signal, WritableSignal } from '@angular/core';
  import { ThemeSwitcher } from './theme-switcher';
  import { ThemeService } from '../../services/themeService/theme-service';


  describe('ThemeSwitcher', () => {
    let component: ThemeSwitcher;
    let fixture: ComponentFixture<ThemeSwitcher>;
    let mockThemeService: { isDark: WritableSignal<boolean>, onToogleDarkMode(): void };

    beforeEach(async () => {
      mockThemeService = {
        isDark: signal(false),
        onToogleDarkMode: ()=>{mockThemeService.isDark.update(value => !value)},
      };

      await TestBed.configureTestingModule({
        imports: [ThemeSwitcher],
        providers: [
          {provide: ThemeService, useValue: mockThemeService},
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ThemeSwitcher);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should apply "light" on click when isDark is true', () => {
      component.themeService.isDark.set(true);
      const checkboxElement: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
      checkboxElement.click();
      fixture.detectChanges();
      expect(mockThemeService.isDark()).toBe(false);
    });

    it('should apply "dark" on click when isDark is false', () => {
      component.themeService.isDark.set(false);
      const checkboxElement: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
      checkboxElement.click();
      fixture.detectChanges();

      expect(mockThemeService.isDark()).toBe(true);
    });
  })
