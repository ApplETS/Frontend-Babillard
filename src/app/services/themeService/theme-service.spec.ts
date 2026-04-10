import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme-service';
import { RendererFactory2 } from '@angular/core';

describe('ThemeService', () => {
  let service: ThemeService;
  const rendererMock= {
    setAttribute: vi.fn(),
    addClass: vi.fn(),
    removeClass: vi.fn(),
  };
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };
  const rendererFactoryMock = {
    createRenderer: vi.fn().mockReturnValue(rendererMock),
  };
  beforeEach(() => {

    vi.stubGlobal('localStorage', localStorageMock);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: rendererFactoryMock },
      ],});
    service = TestBed.inject(ThemeService);
  });

  it('should update DOM and localStorage when isDark have been changed to true', () => {
    service.isDark.set(true);

    TestBed.tick();

    expect(rendererMock.setAttribute).toHaveBeenCalledWith(expect.any(HTMLElement), 'data-theme', 'dark');
    expect(rendererMock.addClass).toHaveBeenCalledWith(expect.any(HTMLElement), 'dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should update DOM and localStorage when isDark have been changed to false', () => {
    service.isDark.set(false);

    TestBed.tick()

    expect(rendererMock.setAttribute).toHaveBeenCalledWith(expect.any(HTMLElement), 'data-theme', 'light');
    expect(rendererMock.removeClass).toHaveBeenCalledWith(expect.any(HTMLElement), 'dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
