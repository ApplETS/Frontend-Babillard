import { Component, effect, model } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lang-switcher',
  imports: [FormsModule],
  templateUrl: './lang-switcher.html',
  styleUrl: './lang-switcher.css',
})

export class LangSwitcher {
  public lang: string[];
  public selectedLang= model<string>();
  constructor(private transloco: TranslocoService) {
    this.selectedLang.set(this.transloco.getActiveLang());
    this.lang = transloco.getAvailableLangs().map(lang => lang.toString());
    effect(()=>{
      const val = this.selectedLang();
      if(val) {
        this.transloco.setActiveLang(val);
      }
    })
  }
}
