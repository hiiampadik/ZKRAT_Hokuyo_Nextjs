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
import { VideoPlayer } from './components/VideoPlayer';
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

// Video route components
const Video1 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-001FINAL.mp4"
    nextRoute="/page1"
    requireClick={true}
  />
);

const Video2 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-002FINAL.mp4"
    nextRoute="/page2"
  />
);

const Video3 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-004FINAL.mp4"
    nextRoute="/page3"
  />
);

const Video4 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-005FINAL.mp4"
    nextRoute="/page4"
  />
);

const Video5 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-006FINAL.mp4"
    nextRoute="/page5"
  />
);

const Video6 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-008FINAL.mp4"
    nextRoute="/page6"
  />
);

const Video7 = () => (
  <VideoPlayer
    videoSrc="/videos/krecek-4K-009FINAL.mp4"
    nextRoute="/"
  />
);

// Create child routes - Video sequence
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Video1,
});

const video2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video2',
  component: Video2,
});

const video3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video3',
  component: Video3,
});

const video4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video4',
  component: Video4,
});

const video5Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video5',
  component: Video5,
});

const video6Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video6',
  component: Video6,
});

const video7Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'video7',
  component: Video7,
});

// Page routes
const page1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'page1',
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
  page1Route,
  video2Route,
  page2Route,
  video3Route,
  page3Route,
  video4Route,
  page4Route,
  video5Route,
  page5Route,
  video6Route,
  page6Route,
  video7Route,
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