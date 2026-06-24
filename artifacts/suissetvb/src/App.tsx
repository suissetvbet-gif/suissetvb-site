import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

import Home from "@/pages/home";
import Wheelbet from "@/pages/wheelbet";
import Fifa from "@/pages/fifa";
import Auth from "@/pages/auth";
import AuthCallback from "@/pages/auth-callback";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Subscribe from "@/pages/subscribe";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFailed from "@/pages/payment-failed";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { HamburgerMenu } from "@/components/HamburgerMenu";

const queryClient = new QueryClient();

// Protected Route wrapper component
function ProtectedRoute({ component: Component }: { component: any }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect to="/auth" />;
  return <Component />;
}

// Admin Route wrapper — requires is_admin = true
function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect to="/auth" />;
  if (!isAdmin) return <Redirect to="/" />;
  return <Admin />;
}

function Router() {
  return (
    <>
      <HamburgerMenu />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/auth/callback" component={AuthCallback} />
        
        <Route path="/wheelbet">
          <ProtectedRoute component={Wheelbet} />
        </Route>
        
        <Route path="/fifa">
          <ProtectedRoute component={Fifa} />
        </Route>
        
        <Route path="/settings">
          <ProtectedRoute component={Settings} />
        </Route>
        
        <Route path="/profile">
          <ProtectedRoute component={Profile} />
        </Route>
        
        <Route path="/subscribe/:plan">
          <ProtectedRoute component={Subscribe} />
        </Route>
        
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/payment-failed" component={PaymentFailed} />

        <Route path="/admin">
          <AdminRoute />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
