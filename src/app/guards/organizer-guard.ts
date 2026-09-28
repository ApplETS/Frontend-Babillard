import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserType } from '@models/user-types';
import { AuthService } from '@services/authService/auth.service';

export const organizerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return false;
  }

  const role = authService.userInfo()?.type;

  if (role === undefined) {
    return false;
  }

  const matches = role.match(UserType.ORGANIZER);
  return matches !== null && matches.length > 0;
};
