import { CanMatchFn } from '@angular/router';

export const isNavHeadNoActiveGuard: CanMatchFn = (route, segments) => {
  return false;
};
