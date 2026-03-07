/**
 * Route/screen name constants. Use these instead of string literals.
 */

export const ROUTE_HOME = 'home' as const;
export const ROUTE_EXPLORE = 'explore' as const;
export const ROUTE_PROFILE = 'profile' as const;

export const ROUTES = [ROUTE_HOME, ROUTE_EXPLORE, ROUTE_PROFILE] as const;

export type RouteName = (typeof ROUTES)[number];
