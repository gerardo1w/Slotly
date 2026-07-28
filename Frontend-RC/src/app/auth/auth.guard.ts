import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Optional role checks based on route data if needed
    const expectedRoles = route.data['roles'] as Array<string>;
    if (expectedRoles && expectedRoles.length > 0) {
      const user = authService.getUserProfile();
      if (!user || !expectedRoles.includes(user.role)) {
        // Redirect to home or login if role not allowed
        router.navigate(['/home']);
        return false;
      }
    }
    return true;
  }

  // Redirect to login page
  router.navigate(['/login']);
  return false;
};
