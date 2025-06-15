
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { DataProvider } from "@/contexts/DataContext";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Pipeline from "@/pages/Pipeline";
import Tasks from "@/pages/Tasks";
import Communications from "@/pages/Communications";
import Meetings from "@/pages/Meetings";
import Templates from "@/pages/Templates";
import Integration from "@/pages/Integration";
import NotFound from "@/pages/NotFound";
import OrganizationSetup from "@/pages/OrganizationSetup";
import { Toaster } from "@/components/ui/toaster";

function AppContent() {
  const { orgId } = useAuth();
  
  console.log('App component rendering with orgId:', orgId);
  
  // If user is signed in but no organization, show organization setup
  if (!orgId) {
    return <OrganizationSetup />;
  }
  
  return (
    <div className="app-wrapper">
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </DataProvider>
    </div>
  );
}

function App() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <AppContent />
      </SignedIn>
    </>
  );
}

export default App;
