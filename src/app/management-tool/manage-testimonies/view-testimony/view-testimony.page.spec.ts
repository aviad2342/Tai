import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTestimonyPage } from './view-testimony.page';

describe('ViewTestimonyPage', () => {
  let component: ViewTestimonyPage;
  let fixture: ComponentFixture<ViewTestimonyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTestimonyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTestimonyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
