
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const NewTemplateForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    category: "General",
    tags: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Integrate with backend/database
    console.log("Creating template:", formData);
    
    toast({
      title: "Template Created",
      description: `${formData.name} template has been saved.`,
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>New Email Template</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Template Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="e.g., Welcome Email, Follow-up"
          />
        </div>
        
        <div>
          <Label htmlFor="subject">Email Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            required
            placeholder="Email subject line"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="General">General</option>
            <option value="Introduction">Introduction</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Proposal">Proposal</option>
            <option value="Closing">Closing</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="sales, cold-outreach, warm (comma separated)"
          />
        </div>
        
        <div>
          <Label htmlFor="body">Email Body *</Label>
          <Textarea
            id="body"
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            required
            placeholder="Dear [Contact Name],&#10;&#10;Your email content here...&#10;&#10;Best regards,&#10;[Your Name]"
            rows={8}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Template</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewTemplateForm;
