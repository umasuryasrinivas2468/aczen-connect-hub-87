
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const NewDealForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const { addDeal } = useData();
  const [formData, setFormData] = useState({
    title: "",
    contact: "",
    value: "",
    stage: "New",
    notes: "",
    expectedCloseDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addDeal(formData);
    console.log("Creating deal:", formData);
    
    toast({
      title: "Deal Created",
      description: `${formData.title} has been added to your pipeline.`,
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>New Deal</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Deal Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            placeholder="Enter deal title"
          />
        </div>
        
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
            placeholder="Associated contact name"
          />
        </div>
        
        <div>
          <Label htmlFor="value">Deal Value (₹)</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            placeholder="50000"
          />
        </div>
        
        <div>
          <Label htmlFor="stage">Stage</Label>
          <select
            id="stage"
            value={formData.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal">Proposal</option>
            <option value="Won">Won</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
          <Input
            id="expectedCloseDate"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Deal notes and details"
            rows={3}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Deal</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewDealForm;
