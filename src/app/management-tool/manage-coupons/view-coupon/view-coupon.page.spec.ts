import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewCouponPage } from './view-coupon.page';

describe('ViewCouponPage', () => {
  let component: ViewCouponPage;
  let fixture: ComponentFixture<ViewCouponPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCouponPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
