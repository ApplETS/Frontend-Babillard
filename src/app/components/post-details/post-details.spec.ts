import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetails } from './post-details';
import { TagService } from '@services/tagService/tag-service';
import { Tag } from '@models/tag';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { FormField } from '@angular/forms/signals';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalMode } from '@models/modal-mode';
import { signal, twoWayBinding } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

describe('PreviewDetails', () => {
  let component: PostDetails;
  let fixture: ComponentFixture<PostDetails>;

  let tagService = {
    getAllTags: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostDetails,
        FormField,
        FaIconComponent,
                TranslocoTestingModule.forRoot({
          langs: {
            en: {},
            fr: {},
          },
          translocoConfig: {
            availableLangs: ['en', 'fr'],
            defaultLang: 'en',
          }
        }),

      ],
      providers: [
        { provide: TagService, useValue: tagService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetails, {bindings: [twoWayBinding('modalMode', signal(ModalMode.create))]});
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
