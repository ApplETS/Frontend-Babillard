import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSwitcher } from './lang-switcher';
import { model, ModelSignal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { expect } from 'vitest';

describe('LangSwitcher', () => {
  let component: LangSwitcher;
  let fixture: ComponentFixture<LangSwitcher>;
  let mockTranslocoService: {
    getActiveLang(): string,
    setActiveLang(activeLang: string): void,
    getAvailableLangs(): string[]
  }

  beforeEach(async () => {
    mockTranslocoService = {
      getActiveLang: vi.fn().mockReturnValue('en'),
      setActiveLang:vi.fn(),
      getAvailableLangs: vi.fn().mockReturnValue(['en', 'fr']),
    };
    await TestBed.configureTestingModule({
      imports: [LangSwitcher],
      providers: [{provide: TranslocoService, useValue: mockTranslocoService}]
    }).compileComponents();

    fixture = TestBed.createComponent(LangSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component with active language', () => {
    expect(component).toBeTruthy();
    expect(component.selectedLang()).toBe('en')
  });

  it('Should start the language switch logic when new value selected', async () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'fr';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedLang()).toBe('fr');
    expect(mockTranslocoService.setActiveLang).toHaveBeenCalledWith('fr')
  })
});
