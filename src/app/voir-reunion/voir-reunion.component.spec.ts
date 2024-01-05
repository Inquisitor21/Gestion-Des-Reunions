import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirReunionComponent } from './voir-reunion.component';

describe('VoirReunionComponent', () => {
  let component: VoirReunionComponent;
  let fixture: ComponentFixture<VoirReunionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoirReunionComponent]
    });
    fixture = TestBed.createComponent(VoirReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
