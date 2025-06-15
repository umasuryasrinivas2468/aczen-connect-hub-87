
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import NewDealForm from "@/components/forms/NewDealForm";

const Pipeline = () => {
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  
  const stages = [
    { name: "New", deals: 0, value: "₹0" },
    { name: "Contacted", deals: 0, value: "₹0" },
    { name: "Proposal", deals: 0, value: "₹0" },
    { name: "Won", deals: 0, value: "₹0" },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track your deals through the sales process</p>
          </div>
          <Dialog open={isNewDealOpen} onOpenChange={setIsNewDealOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </DialogTrigger>
            <NewDealForm onClose={() => setIsNewDealOpen(false)} />
          </Dialog>
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
                    <div className="text-center py-16 text-gray-400">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No deals in {stage.name}</p>
                      <p className="text-xs">Add deals to get started</p>
                    </div>
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
