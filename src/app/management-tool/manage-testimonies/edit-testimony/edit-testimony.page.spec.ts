import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditTestimonyPage } from './edit-testimony.page';

describe('EditTestimonyPage', () => {
  let component: EditTestimonyPage;
  let fixture: ComponentFixture<EditTestimonyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTestimonyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTestimonyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
