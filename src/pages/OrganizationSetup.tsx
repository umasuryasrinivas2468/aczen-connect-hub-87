
import { CreateOrganization, OrganizationList, useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const OrganizationSetup = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showList, setShowList] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {!showCreate && !showList && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold text-white">Welcome to Aczen</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Get started by creating a new organization or joining an existing one
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => setShowCreate(true)}>
                <CardHeader className="text-center">
                  <Plus className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">Create Organization</CardTitle>
                  <CardDescription className="text-gray-300">
                    Start fresh with a new organization for your team
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => setShowList(true)}>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">Join Organization</CardTitle>
                  <CardDescription className="text-gray-300">
                    Join an existing organization you've been invited to
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-8">
              <Button 
                variant="ghost" 
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {showCreate && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl">Create Your Organization</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCreate(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Back
                </Button>
              </div>
              <CardDescription className="text-gray-300">
                Set up your organization to start managing your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateOrganization 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-300",
                    formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                    formFieldInput: "bg-gray-700 border-gray-600 text-white",
                    formFieldLabel: "text-gray-300",
                    identityPreviewText: "text-white",
                    identityPreviewEditButton: "text-purple-400"
                  }
                }}
              />
            </CardContent>
          </Card>
        )}

        {showList && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl">Join Organization</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowList(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Back
                </Button>
              </div>
              <CardDescription className="text-gray-300">
                Select an organization to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationList 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-300",
                    organizationListContainer: "bg-gray-700/50 rounded-lg",
                    organizationPreview: "bg-gray-600/50 hover:bg-gray-600/70 border-gray-500",
                    organizationPreviewAvatarBox: "border-gray-500",
                    organizationPreviewMainIdentifier: "text-white",
                    organizationPreviewSecondaryIdentifier: "text-gray-300"
                  }
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default OrganizationSetup;
