import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-aide',
  templateUrl: './aide.component.html',
  styleUrls: ['./aide.component.css']
})
export class AideComponent {
    @Input() selectedLanguage='fr';
    @Input() aideContentKeys: string[] = [];
    @Input() aideTitre: string = '';
}
