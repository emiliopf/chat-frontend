import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: RoomChatComponent;
  let fixture: ComponentFixture<RoomChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
