import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockService } from 'ng-mocks';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await MockBuilder(AuthService)
      .keep(HttpClientTestingModule)
      .mock(Router, routerSpy);

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login and set authUser on valid credentials', () => {
    const dummyUser: User = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      password: 'pass',
      role: 'user',
      token: 'tk123',
    };
    spyOn(localStorage, 'setItem');
    let emitted: User;
    service.authUser$.subscribe((u) => {
      if (u) {
        emitted = u;
      }
    });

    service.login('test@example.com', 'pass');
    const req = httpMock.expectOne(
      'http://localhost:3000/users?email=test@example.com&password=pass'
    );
    expect(req.request.method).toBe('GET');
    req.flush([dummyUser]);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'tk123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(emitted!).toEqual(dummyUser);
  });

  it('should alert on invalid credentials', () => {
    spyOn(window, 'alert');
    service.login('wrong', 'creds');
    const req = httpMock.expectOne(
      'http://localhost:3000/users?email=wrong&password=creds'
    );
    req.flush([], { status: 200, statusText: 'OK' });
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should logout and clear authUser', () => {
    spyOn(localStorage, 'removeItem');
    let emitted: User | null = null;
    service.authUser$.subscribe((u) => (emitted = u));

    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(emitted).toBeNull();
  });

  it('verifyToken returns user when token valid', () => {
    const valid: User = {
      id: 'x',
      username: 'u',
      email: 'e',
      password: 'p',
      role: 'user',
      token: 'tok',
    };
    localStorage.setItem('token', 'tok');
    let result: User | boolean = false;
    service.verifyToken().subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:3000/users?token=tok');
    expect(req.request.method).toBe('GET');
    req.flush([valid]);

    expect(typeof result).not.toBe('boolean');

    if (typeof result !== 'boolean') {
      expect(result).toEqual(valid);
    }
  });

  it('verifyToken returns false when token invalid', () => {
    localStorage.setItem('token', 'bad');
    let result: User | boolean = true;
    service.verifyToken().subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:3000/users?token=bad');
    req.flush([], { status: 200, statusText: 'OK' });

    expect(result).toBeFalse();
  });
});
