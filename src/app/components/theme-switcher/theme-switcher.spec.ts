  import { ComponentFixture, TestBed } from '@angular/core/testing';

  import { ThemeSwitcher } from './theme-switcher';
  import { App } from '../../app';

  describe('ThemeSwitcher', () => {
    let component: ThemeSwitcher;
    let fixture: ComponentFixture<ThemeSwitcher>;
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    beforeEach(async () => {

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });

      await TestBed.configureTestingModule({
        imports: [ThemeSwitcher]
      }).compileComponents();

      fixture = TestBed.createComponent(ThemeSwitcher);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should apply "dark" theme when isDark is true', () => {
      component.isDark.set(true);
      fixture.detectChanges();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should apply "light" theme when isDark is false', () => {
      component.isDark.set(false);
      fixture.detectChanges();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  })
