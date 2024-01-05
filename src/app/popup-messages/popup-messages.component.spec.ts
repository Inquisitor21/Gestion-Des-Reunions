import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMessagesComponent } from './popup-messages.component';

describe('PopupMessagesComponent', () => {
  let component: PopupMessagesComponent;
  let fixture: ComponentFixture<PopupMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupMessagesComponent]
    });
    fixture = TestBed.createComponent(PopupMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
