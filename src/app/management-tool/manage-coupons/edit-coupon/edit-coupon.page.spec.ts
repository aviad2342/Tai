import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCouponPage } from './edit-coupon.page';

describe('EditCouponPage', () => {
  let component: EditCouponPage;
  let fixture: ComponentFixture<EditCouponPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCouponPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
