import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyHtrComponent } from './buy-htr.component';

describe('BuyHtrComponent', () => {
  let component: BuyHtrComponent;
  let fixture: ComponentFixture<BuyHtrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyHtrComponent]
    });
    fixture = TestBed.createComponent(BuyHtrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
