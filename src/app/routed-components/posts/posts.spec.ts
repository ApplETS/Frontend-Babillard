import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Posts } from './posts';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('Posts', () => {
  let component: Posts;
  let fixture: ComponentFixture<Posts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Posts,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {},
            fr: {},
          },
          preloadLangs: true,
          translocoConfig: {
          }
        })
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Posts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
