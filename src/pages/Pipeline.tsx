
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, DollarSign } from "lucide-react";

const Pipeline = () => {
  const stages = [
    { name: "New", deals: 5, value: "₹2,50,000" },
    { name: "Contacted", deals: 8, value: "₹4,80,000" },
    { name: "Proposal", deals: 3, value: "₹1,20,000" },
    { name: "Won", deals: 12, value: "₹6,40,000" },
  ];

  const deals = [
    { id: 1, name: "Acme Corp Deal", company: "Acme Corp", value: "₹2,50,000", stage: "New" },
    { id: 2, name: "Tech Solutions Project", company: "Tech Solutions", value: "₹1,80,000", stage: "Contacted" },
    { id: 3, name: "Global Industries Contract", company: "Global Industries", value: "₹3,20,000", stage: "Proposal" },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track your deals through the sales process</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>

        {/* Pipeline Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stages.map((stage, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stage.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stage.deals}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <DollarSign className="h-3 w-3" />
                  {stage.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban Board Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Board</CardTitle>
            <CardDescription>Drag and drop deals between stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stages.map((stage, stageIndex) => (
                <div key={stageIndex} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <Badge variant="secondary">{stage.deals}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[400px] bg-gray-50 rounded-lg p-3">
                    {deals
                      .filter(deal => deal.stage === stage.name)
                      .map((deal) => (
                        <Card key={deal.id} className="cursor-move hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="font-medium text-sm">{deal.name}</div>
                            <div className="text-xs text-gray-500 mb-2">{deal.company}</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">{deal.value}</Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Pipeline;
