import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLotteryComponent } from './my-lottery.component';

describe('MyLotteryComponent', () => {
  let component: MyLotteryComponent;
  let fixture: ComponentFixture<MyLotteryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyLotteryComponent]
    });
    fixture = TestBed.createComponent(MyLotteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
