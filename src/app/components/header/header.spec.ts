import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';

import { HeaderComponent } from './header';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { AuthService } from '@services/authService/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpParams, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LangSwitcher } from '@components/lang-switcher/lang-switcher';
import { ThemeSwitcher } from '@components/theme-switcher/theme-switcher';
import { ThemeService } from '@services/themeService/theme.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Avatar } from '@components/avatar/avatar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DOCUMENT, RendererFactory2, signal } from '@angular/core';
import { UserResponseDTO } from '@models/userResponseDTO.interface';
import { UserType } from '@models/user-types';

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let oidcSecurityService: any;
  let authService: AuthService;

  beforeEach(async () => {
    oidcSecurityService = {
      isAuthenticated: of(vi.fn().mockReturnValue(false)),
      checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: false })),
      authenticated: vi.fn().mockReturnValue({ isAuthenticated: false }),
      getAccessToken: vi.fn().mockReturnValue(of('mock-token')),
      userData$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, fr: {} },
          translocoConfig: { defaultLang: 'en' },
        }),
        FaIconComponent,
      ],
      providers: [
        { provide: OidcSecurityService, useValue: oidcSecurityService },
        AuthService,
        Router,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    .overrideComponent(HeaderComponent, {
      set: {
        template: "<div></div>",
        imports: [
          FaIconComponent
        ]
      }
    })
    .compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(HeaderComponent);

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Guest routes', () => {
    const routes = component.routes();

    expect(routes.length).toBe(1);
    expect(routes[0].route).toBe("/");
  });

  it('should show Authenticated routes', () => {
    authService.isAuthenticated.set(true);
    fixture.detectChanges();

    const routes = component.routes();
    console.log(routes);

    expect(routes.length).toBe(2);
    expect(routes[0].route).toBe("/");
    expect(routes[1].route).toBe("/posts");
  });

  it('should show Moderator routes', () => {
    authService.isAuthenticated.set(true);
    authService.userInfo.set({ type: UserType.MODERATOR });
    fixture.detectChanges();

    const routes = component.routes();
    console.log(routes);

    expect(routes.length).toBe(3);
    expect(routes.some(route => route.route === "/approval")).toBe(true);
  });

  it('show show Moderator routes, User with multiple roles', () => {
    authService.isAuthenticated.set(true);
    authService.userInfo.set({ type: [UserType.MODERATOR, UserType.ORGANIZER].join(',') });
    console.log(authService.userInfo());

    fixture.detectChanges();

    const routes = component.routes();
    console.log(routes);

    expect(routes.length).toBe(3);
    expect(routes.some(route => route.route === "/approval")).toBe(true);
  })

  afterEach(() => {
    authService.isAuthenticated.set(false);
    authService.userInfo.set(undefined);
  })
});
