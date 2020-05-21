import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttExampleComponent } from './mqtt-example.component';

describe('MqttExampleComponent', () => {
  let component: MqttExampleComponent;
  let fixture: ComponentFixture<MqttExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
