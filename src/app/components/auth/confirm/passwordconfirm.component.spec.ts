import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {PasswordConfirmComponent} from './passwordconfirm.component';
import { UserService } from 'app/services/user.service';

describe('PasswordRestComponent', () => {
  let component: PasswordConfirmComponent;
  let fixture: ComponentFixture<PasswordConfirmComponent>;
 let testBedService: UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordConfirmComponent],
      providers: [UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordConfirmComponent);
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
