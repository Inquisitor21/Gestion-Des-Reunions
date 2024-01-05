import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerReunionComponent } from './creer-reunion.component';

describe('CreationConsultationComponent', () => {
  let component: CreerReunionComponent;
  let fixture: ComponentFixture<CreerReunionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreerReunionComponent]
    });
    fixture = TestBed.createComponent(CreerReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
