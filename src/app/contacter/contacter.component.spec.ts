import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacterComponent } from './contacter.component';

describe('ContactComponent', () => {
  let component: ContacterComponent;
  let fixture: ComponentFixture<ContacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContacterComponent]
    });
    fixture = TestBed.createComponent(ContacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
