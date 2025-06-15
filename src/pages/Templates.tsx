
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Edit, Copy, Zap } from "lucide-react";

const Templates = () => {
  const templates = [
    {
      id: 1,
      name: "Introduction Email",
      category: "Intro",
      usage: 24,
      lastUsed: "2 days ago",
      preview: "Hi {{name}}, I hope this email finds you well. I wanted to reach out to introduce myself and our services..."
    },
    {
      id: 2,
      name: "Follow-up After Meeting",
      category: "Follow-up",
      usage: 18,
      lastUsed: "1 week ago",
      preview: "Thank you for taking the time to meet with me today. As discussed, I'm attaching the proposal..."
    },
    {
      id: 3,
      name: "Proposal Submission",
      category: "Closing",
      usage: 12,
      lastUsed: "3 days ago",
      preview: "I'm excited to submit our proposal for your consideration. This comprehensive solution..."
    },
    {
      id: 4,
      name: "Check-in Email",
      category: "Follow-up",
      usage: 31,
      lastUsed: "Yesterday",
      preview: "I wanted to check in and see how things are progressing on your end..."
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Intro": return "default";
      case "Follow-up": return "secondary";
      case "Closing": return "outline";
      default: return "default";
    }
  };

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
              <div className="text-2xl font-bold text-gray-900">24</div>
              <p className="text-xs text-gray-500">Active templates</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">31</div>
              <p className="text-xs text-gray-500">Check-in Email</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">128</div>
              <p className="text-xs text-gray-500">Templates used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">8</div>
              <p className="text-xs text-gray-500">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <CardDescription>
                  Used {template.usage} times • Last used {template.lastUsed}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {template.preview}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm">
                    <Mail className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Assistant Card */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
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
