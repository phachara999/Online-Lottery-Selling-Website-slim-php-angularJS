import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnUserComponent } from './mn-user.component';

describe('MnUserComponent', () => {
  let component: MnUserComponent;
  let fixture: ComponentFixture<MnUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MnUserComponent]
    });
    fixture = TestBed.createComponent(MnUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
