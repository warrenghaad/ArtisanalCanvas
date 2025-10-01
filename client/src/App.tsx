import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Academy from "@/pages/academy";
import ETextbookExplorer from "@/pages/etextbook-explorer";
import CurriculumDashboard from "@/pages/curriculum-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Academy} />
      <Route path="/academy" component={Academy} />
      <Route path="/etextbooks" component={ETextbookExplorer} />
      <Route path="/curriculum" component={CurriculumDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
