import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import Page1 from './pages/1/Page1';
import Page2 from './pages/2/Page2';
import Page3 from './pages/3/Page3';
import Page4 from './pages/4/Page4';
import Page5 from './pages/5/Page5';
import Page6 from './pages/6/Page6';
import { useNumberKeyNavigation } from './hooks/useNumberKeyNavigation';

// Root layout component
function RootLayout() {
  useNumberKeyNavigation();

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Create the root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Create child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Page1,
});

const page2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page2',
  component: Page2,
});

const page3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page3',
  component: Page3,
});

const page4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page4',
  component: Page4,
});

const page5Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page5',
  component: Page5,
});

const page6Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page6',
  component: Page6,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  page2Route,
  page3Route,
  page4Route,
  page5Route,
  page6Route,
]);

// Create and export the router
export const router = createRouter({
  routeTree,
  basepath: '/',
});

// Type registration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}