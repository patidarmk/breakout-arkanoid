import * as React from "react";
import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createRoute as createTanStackRoute,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "@/components/Header";
import { MadeWithApplaa } from "@/components/made-with-applaa";

import Index from "./pages/Index";
import Play from "./pages/Play";
import Levels from "./pages/Levels";
import LevelDetail from "./pages/LevelDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create root route with a polished layout that includes the required sticky header,
// glassmorphism background and footer with Applaa branding.
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="sticky top-0 z-50">
            <Header />
          </div>

          <main className="max-w-7xl mx-auto px-6 py-10">
            <Outlet />
          </main>

          <footer className="mt-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-lg shadow-inner p-4">
                <MadeWithApplaa />
              </div>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  ),
});

// Create routes for all pages to avoid 404 when navigating via header/buttons.
const indexRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

const playRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: Play,
});

const levelsRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/levels",
  component: Levels,
});

const levelDetailRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/levels/:id",
  component: LevelDetail,
});

const aboutRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const contactRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});

// Catch-all route to render a friendly NotFound page for unmatched URLs
const notFoundRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: "/*",
  component: NotFound,
});

// assemble the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  playRoute,
  levelsRoute,
  levelDetailRoute,
  aboutRoute,
  contactRoute,
  notFoundRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent" as const,
  defaultPreloadStaleTime: 0,
});

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => <RouterProvider router={router} />;

export default App;