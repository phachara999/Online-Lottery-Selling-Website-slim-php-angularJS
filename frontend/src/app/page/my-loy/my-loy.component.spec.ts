import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLoyComponent } from './my-loy.component';

describe('MyLoyComponent', () => {
  let component: MyLoyComponent;
  let fixture: ComponentFixture<MyLoyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyLoyComponent]
    });
    fixture = TestBed.createComponent(MyLoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
