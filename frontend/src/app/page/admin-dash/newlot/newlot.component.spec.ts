import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlotComponent } from './newlot.component';

describe('NewlotComponent', () => {
  let component: NewlotComponent;
  let fixture: ComponentFixture<NewlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewlotComponent]
    });
    fixture = TestBed.createComponent(NewlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
