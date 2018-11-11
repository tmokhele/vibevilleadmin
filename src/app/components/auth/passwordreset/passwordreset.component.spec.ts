import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {PasswordResetComponent} from './passwordreset.component';
import { UserService } from 'app/services/user.service';

describe('PasswordRestComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
 let testBedService: UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      providers: [UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    testBedService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
  inject([UserService], (injectService: UserService) => {
    expect(injectService).toBe(testBedService);
  })
);
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
