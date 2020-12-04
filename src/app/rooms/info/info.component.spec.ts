import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomInfoComponent } from './info.component';

describe('InfoComponent', () => {
  let component: RoomInfoComponent;
  let fixture: ComponentFixture<RoomInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
