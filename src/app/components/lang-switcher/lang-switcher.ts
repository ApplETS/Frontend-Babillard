import { Component, effect, inject, model } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lang-switcher',
  imports: [FormsModule],
  templateUrl: './lang-switcher.html'
})

export class LangSwitcher {
  private transloco = inject(TranslocoService);
  public selectedLang= model<string>(this.transloco.getActiveLang());
  public lang = this.transloco.getAvailableLangs().map(lang => lang.toString());
  constructor() {
    effect(()=>{
      const newLang = this.selectedLang();
      if(this.lang.includes(newLang!) && newLang !== this.transloco.getActiveLang()) {
        this.transloco.setActiveLang(newLang);
      }
    })
  }
}
