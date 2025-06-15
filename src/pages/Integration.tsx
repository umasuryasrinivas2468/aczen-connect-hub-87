
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Eye, Trash2, ExternalLink, BarChart3, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

interface FormAnalytics {
  totalSubmissions: number;
  thisWeekSubmissions: number;
  thisMonthSubmissions: number;
  conversionRate: number;
}

interface IntegrationForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  embedUrl: string;
  createdAt: Date;
  analytics: FormAnalytics;
}

const MAX_FORMS = 3;

const Integration = () => {
  const [forms, setForms] = useState<IntegrationForm[]>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<Partial<IntegrationForm>>({
    name: '',
    description: '',
    fields: []
  });
  const [previewForm, setPreviewForm] = useState<IntegrationForm | null>(null);
  const [showSupabaseCode, setShowSupabaseCode] = useState<IntegrationForm | null>(null);
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' }
  ];

  const generateRandomId = () => Math.random().toString(36).substr(2, 9);
  
  const generateEmbedUrl = () => {
    const formId = generateRandomId();
    return `${window.location.origin}/embed/${formId}`;
  };

  const generateMockAnalytics = (): FormAnalytics => ({
    totalSubmissions: Math.floor(Math.random() * 500) + 10,
    thisWeekSubmissions: Math.floor(Math.random() * 50) + 1,
    thisMonthSubmissions: Math.floor(Math.random() * 200) + 5,
    conversionRate: Math.floor(Math.random() * 15) + 2
  });

  const addField = () => {
    const newField: FormField = {
      id: generateRandomId(),
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    
    setCurrentForm(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields?.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ) || []
    }));
  };

  const removeField = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== fieldId) || []
    }));
  };

  const saveForm = () => {
    if (forms.length >= MAX_FORMS) {
      toast({
        title: "Form Limit Reached",
        description: `You can only create ${MAX_FORMS} forms. Delete an existing form to create a new one.`,
        variant: "destructive"
      });
      return;
    }

    if (!currentForm.name || !currentForm.fields?.length) {
      toast({
        title: "Error",
        description: "Please provide a form name and at least one field",
        variant: "destructive"
      });
      return;
    }

    const newForm: IntegrationForm = {
      id: generateRandomId(),
      name: currentForm.name!,
      description: currentForm.description || '',
      fields: currentForm.fields!,
      embedUrl: generateEmbedUrl(),
      createdAt: new Date(),
      analytics: generateMockAnalytics()
    };

    setForms(prev => [...prev, newForm]);
    setCurrentForm({ name: '', description: '', fields: [] });
    setIsCreateFormOpen(false);
    
    toast({
      title: "Success",
      description: "Integration form created successfully"
    });
  };

  const copyEmbedCode = (form: IntegrationForm) => {
    const embedCode = `<iframe src="${form.embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard"
    });
  };

  const copySupabaseCode = (form: IntegrationForm) => {
    const supabaseCode = generateSupabaseCode(form);
    navigator.clipboard.writeText(supabaseCode);
    toast({
      title: "Copied!",
      description: "Supabase code copied to clipboard"
    });
  };

  const generateSupabaseCode = (form: IntegrationForm) => {
    const tableName = `form_submissions_${form.name.toLowerCase().replace(/\s+/g, '_')}`;
    const fieldDefinitions = form.fields.map(field => {
      const fieldType = field.type === 'email' ? 'text' : field.type === 'phone' ? 'text' : 'text';
      return `  ${field.name} ${fieldType}${field.required ? ' NOT NULL' : ''}`;
    }).join(',\n');

    return `-- Create table for ${form.name} form submissions
CREATE TABLE ${tableName} (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
${fieldDefinitions},
  ip_address text,
  user_agent text
);

-- Enable RLS
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting submissions (public access)
CREATE POLICY "Allow public inserts" ON ${tableName}
  FOR INSERT WITH CHECK (true);

-- Create policy for viewing submissions (authenticated users only)
CREATE POLICY "Allow authenticated users to view" ON ${tableName}
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create Edge Function for form submission
CREATE OR REPLACE FUNCTION handle_${form.name.toLowerCase().replace(/\s+/g, '_')}_submission()
RETURNS trigger AS $$
BEGIN
  -- Log the submission
  INSERT INTO form_analytics (form_id, submission_date, ip_address)
  VALUES ('${form.id}', NOW(), NEW.ip_address);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER on_${form.name.toLowerCase().replace(/\s+/g, '_')}_submission
  AFTER INSERT ON ${tableName}
  FOR EACH ROW
  EXECUTE FUNCTION handle_${form.name.toLowerCase().replace(/\s+/g, '_')}_submission();`;
  };

  const deleteForm = (formId: string) => {
    setForms(prev => prev.filter(form => form.id !== formId));
    toast({
      title: "Deleted",
      description: "Integration form deleted successfully"
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integration</h1>
            <p className="text-gray-600">Create embeddable forms to capture leads from your website ({forms.length}/{MAX_FORMS} forms)</p>
          </div>
          
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={forms.length >= MAX_FORMS}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Integration Form</DialogTitle>
                <DialogDescription>
                  Build a custom form that can be embedded on your website to capture leads
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="formName">Form Name</Label>
                  <Input
                    id="formName"
                    value={currentForm.name || ''}
                    onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contact Form"
                  />
                </div>
                
                <div>
                  <Label htmlFor="formDescription">Description (Optional)</Label>
                  <Textarea
                    id="formDescription"
                    value={currentForm.description || ''}
                    onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this form"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Form Fields</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {currentForm.fields?.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label>Field Name</Label>
                              <Input
                                value={field.name}
                                onChange={(e) => updateField(field.id, { name: e.target.value })}
                                placeholder="name"
                              />
                            </div>
                            <div>
                              <Label>Field Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                placeholder="Full Name"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 items-end">
                            <div>
                              <Label>Field Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: any) => updateField(field.id, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`required-${field.id}`}
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                className="rounded"
                              />
                              <Label htmlFor={`required-${field.id}`}>Required</Label>
                            </div>
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveForm}>
                    Create Form
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {forms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No integration forms created yet</p>
                <Button 
                  onClick={() => setIsCreateFormOpen(true)}
                  disabled={forms.length >= MAX_FORMS}
                >
                  Create Your First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            forms.map(form => (
              <Card key={form.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{form.name}</CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewForm(form)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyEmbedCode(form)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Embed
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSupabaseCode(form)}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Supabase Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(form.embedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteForm(form.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Fields ({form.fields.length})</Label>
                      <div className="mt-1 text-sm text-gray-600">
                        {form.fields.map(field => field.label).join(', ')}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Embed URL</Label>
                      <div className="mt-1 text-sm text-gray-600 break-all">
                        {form.embedUrl}
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <Label className="text-sm font-medium">Analytics</Label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-lg">{form.analytics.totalSubmissions}</div>
                        <div className="text-gray-600">Total Submissions</div>
                      </div>
                      <div>
                        <div className="font-medium text-lg">{form.analytics.thisWeekSubmissions}</div>
                        <div className="text-gray-600">This Week</div>
                      </div>
                      <div>
                        <div className="font-medium text-lg">{form.analytics.thisMonthSubmissions}</div>
                        <div className="text-gray-600">This Month</div>
                      </div>
                      <div>
                        <div className="font-medium text-lg">{form.analytics.conversionRate}%</div>
                        <div className="text-gray-600">Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewForm} onOpenChange={() => setPreviewForm(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Form Preview: {previewForm?.name}</DialogTitle>
            </DialogHeader>
            {previewForm && (
              <div className="space-y-4">
                {previewForm.fields.map(field => (
                  <div key={field.id}>
                    <Label>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea placeholder={`Enter ${field.label.toLowerCase()}`} />
                    ) : field.type === 'select' ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        type={field.type} 
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
                <Button className="w-full">Submit</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Supabase Code Dialog */}
        <Dialog open={!!showSupabaseCode} onOpenChange={() => setShowSupabaseCode(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Supabase Integration Code: {showSupabaseCode?.name}</DialogTitle>
              <DialogDescription>
                Copy this code and run it in your Supabase SQL editor to set up the database table and functions
              </DialogDescription>
            </DialogHeader>
            {showSupabaseCode && (
              <div className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateSupabaseCode(showSupabaseCode)}</code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copySupabaseCode(showSupabaseCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Copy the SQL code above</li>
                    <li>Go to your Supabase dashboard → SQL Editor</li>
                    <li>Paste and run the code</li>
                    <li>Your form submissions will be stored in the created table</li>
                    <li>Use the Supabase API to fetch submissions in your app</li>
                  </ol>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Integration;
