
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import NewDealForm from "@/components/forms/NewDealForm";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Pipeline = () => {
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const { deals, loading, refreshData } = useData();
  const { toast } = useToast();
  
  const stages = ["New", "Contacted", "Proposal", "Won"];
  
  const getStageData = (stageName: string) => {
    const stageDeals = deals.filter(deal => deal.stage === stageName);
    const totalValue = stageDeals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
    return {
      name: stageName,
      deals: stageDeals.length,
      value: `₹${totalValue.toLocaleString()}`,
      items: stageDeals
    };
  };

  const stagesWithData = stages.map(getStageData);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside any droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId;
    const dealId = draggableId;

    try {
      // Update deal stage in database
      const { error } = await supabase
        .from('deals')
        .update({ 
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId);

      if (error) {
        console.error('Error updating deal stage:', error);
        toast({
          title: "Error",
          description: "Failed to update deal stage",
          variant: "destructive",
        });
        return;
      }

      // Show success message
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        if (newStage === "Won") {
          toast({
            title: "Deal Won! 🎉",
            description: `${deal.title} moved to Won. Revenue: ₹${parseFloat(deal.value || '0').toLocaleString()}`,
          });
        } else {
          toast({
            title: "Deal Updated",
            description: `${deal.title} moved to ${newStage}`,
          });
        }
      }

      // Refresh data to reflect changes
      await refreshData();
      
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading pipeline data...</span>
          </div>
        </div>
      </Layout>
    );
  }

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
          {stagesWithData.map((stage, index) => (
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

        {/* Kanban Board with Drag and Drop */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Board</CardTitle>
            <CardDescription>Drag and drop deals between stages</CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stagesWithData.map((stage, stageIndex) => (
                  <div key={stageIndex} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <Badge variant="secondary">{stage.deals}</Badge>
                    </div>
                    <Droppable droppableId={stage.name}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[400px] rounded-lg p-3 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                          }`}
                        >
                          {stage.items.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-sm">No deals in {stage.name}</p>
                              <p className="text-xs">Drag deals here or add new ones</p>
                            </div>
                          ) : (
                            stage.items.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 cursor-grab active:cursor-grabbing transition-shadow ${
                                      snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-200' : 'hover:shadow-md'
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm">{deal.title}</h4>
                                      {deal.contact && (
                                        <p className="text-xs text-gray-600">{deal.contact}</p>
                                      )}
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs">
                                          ₹{parseFloat(deal.value || '0').toLocaleString()}
                                        </Badge>
                                        {deal.expected_close_date && (
                                          <span className="text-xs text-gray-500">
                                            {new Date(deal.expected_close_date).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Pipeline;
