import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnBuyComponent } from './mn-buy.component';

describe('MnBuyComponent', () => {
  let component: MnBuyComponent;
  let fixture: ComponentFixture<MnBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MnBuyComponent]
    });
    fixture = TestBed.createComponent(MnBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
