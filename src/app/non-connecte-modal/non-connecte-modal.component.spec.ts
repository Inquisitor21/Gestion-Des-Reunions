import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConnecteModalComponent } from './non-connecte-modal.component';

describe('NonConnecteModalComponent', () => {
  let component: NonConnecteModalComponent;
  let fixture: ComponentFixture<NonConnecteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonConnecteModalComponent]
    });
    fixture = TestBed.createComponent(NonConnecteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
