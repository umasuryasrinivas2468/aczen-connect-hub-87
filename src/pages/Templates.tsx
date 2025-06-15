
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Mail } from "lucide-react";

const Templates = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-600 mt-1">Save time with reusable email templates</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500">Active templates</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500">Template usage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-xs text-gray-500">Templates used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">0</div>
              <p className="text-xs text-gray-500">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Create and manage your email templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 text-gray-500">
              <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
              <p className="text-gray-400 mb-6">Create your first email template to save time</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Generate
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-900">AI Email Assistant</CardTitle>
            </div>
            <CardDescription className="text-purple-700">
              Let AI help you create personalized email templates based on your contact's stage and needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Zap className="h-4 w-4 mr-2" />
              Generate Email Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Templates;
