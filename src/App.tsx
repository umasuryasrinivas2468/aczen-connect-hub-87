
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { DataProvider } from "@/contexts/DataContext";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Pipeline from "@/pages/Pipeline";
import Tasks from "@/pages/Tasks";
import Communications from "@/pages/Communications";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder-key-for-development";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  console.log('App component rendering');
  
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={
                <>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                </>
              } />
              <Route path="/contacts" element={
                <SignedIn>
                  <Contacts />
                </SignedIn>
              } />
              <Route path="/pipeline" element={
                <SignedIn>
                  <Pipeline />
                </SignedIn>
              } />
              <Route path="/tasks" element={
                <SignedIn>
                  <Tasks />
                </SignedIn>
              } />
              <Route path="/communications" element={
                <SignedIn>
                  <Communications />
                </SignedIn>
              } />
              <Route path="/templates" element={
                <SignedIn>
                  <Templates />
                </SignedIn>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </DataProvider>
    </ClerkProvider>
  );
}

export default App;
