import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { organizerGuard } from './organizer-guard';
import { AuthService } from '@services/authService/auth.service';
import { UserType } from '@models/user-types';

describe('organizerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => organizerGuard(...guardParameters));
  let authService = {
    isAuthenticated: vi.fn(),
    userInfo: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    const result = executeGuard(null!, null!);
    expect(result).toBe(false);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.userInfo).not.toHaveBeenCalled();
  });

  it('should return false when authenticated but has no role', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.userInfo.mockReturnValue({ role: undefined });
    const result = executeGuard(null!, null!);
    expect(result).toBe(false);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.userInfo).toHaveBeenCalled();
  });

  it('should return false when authenticated but not an organizer', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.userInfo.mockReturnValue({ role: 'user' });
    const result = executeGuard(null!, null!);
    expect(result).toBe(false);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.userInfo).toHaveBeenCalled();
  });

  it('should return true when authenticated and is an organizer', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.userInfo.mockReturnValue({ type: UserType.ORGANIZER });
    const result = executeGuard(null!, null!);
    expect(result).toBe(true);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.userInfo).toHaveBeenCalled();
  });
});
