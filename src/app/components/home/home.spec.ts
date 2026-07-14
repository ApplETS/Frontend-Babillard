import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco'; // Adjust path if needed
import { Home } from './home';
import { AuthService } from '../../services/authService/auth.service';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { ThemeService } from '../../services/themeService/theme.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  const mockAuthService = {
    initAuth: vi.fn()
  };
  const mockThemeService = {
    setTheme: vi.fn(),
    currentTheme: signal('light'),
    isDark: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, fr: {} },
          translocoConfig: { defaultLang: 'en' },
        }),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create component and call AuthService ngOnInit', () => {
    const spy = vi.spyOn(mockAuthService, 'initAuth');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
});
