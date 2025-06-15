
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, MessageSquare, Calendar } from "lucide-react";

const Communications = () => {
  const communications = [
    { 
      id: 1, 
      type: "email", 
      contact: "John Smith", 
      company: "Acme Corp", 
      subject: "Follow-up on proposal", 
      date: "2 hours ago",
      summary: "Discussed pricing and timeline for the project"
    },
    { 
      id: 2, 
      type: "call", 
      contact: "Sarah Johnson", 
      company: "Tech Solutions", 
      subject: "Discovery Call", 
      date: "1 day ago",
      summary: "Initial needs assessment and requirements gathering"
    },
    { 
      id: 3, 
      type: "meeting", 
      contact: "Mike Chen", 
      company: "Global Industries", 
      subject: "Demo Presentation", 
      date: "3 days ago",
      summary: "Product demonstration and Q&A session"
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "call": return Phone;
      case "meeting": return Calendar;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email": return "default";
      case "call": return "secondary";
      case "meeting": return "outline";
      default: return "default";
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-1">Track all your client interactions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Communication
          </Button>
        </div>

        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">156</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">89</div>
              <p className="text-xs text-gray-500">57% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">42</div>
              <p className="text-xs text-gray-500">27% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">25</div>
              <p className="text-xs text-gray-500">16% of total</p>
            </CardContent>
          </Card>
        </div>

        {/* Communication Log */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Log</CardTitle>
            <CardDescription>
              All your client interactions in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communications.map((comm) => {
                const IconComponent = getTypeIcon(comm.type);
                return (
                  <div key={comm.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{comm.subject}</h3>
                        <Badge variant={getTypeColor(comm.type)}>
                          {comm.type}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{comm.contact}</span> at {comm.company}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">{comm.summary}</p>
                      
                      <div className="text-xs text-gray-400">{comm.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Communications;
