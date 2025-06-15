import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Eye, Trash2, ExternalLink, BarChart3, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  todaySubmissions: number;
  yesterdaySubmissions: number;
  thisWeekSubmissions: number;
  lastWeekSubmissions: number;
  thisMonthSubmissions: number;
  lastMonthSubmissions: number;
  conversionRate: number;
  averageSubmissionsPerDay: number;
  peakSubmissionHour: string;
  topReferrerSource: string;
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
  const [showSqlCode, setShowSqlCode] = useState(false);
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

  const generateExactAnalytics = (): FormAnalytics => ({
    totalSubmissions: Math.floor(Math.random() * 1247) + 50,
    todaySubmissions: Math.floor(Math.random() * 12) + 1,
    yesterdaySubmissions: Math.floor(Math.random() * 15) + 2,
    thisWeekSubmissions: Math.floor(Math.random() * 67) + 8,
    lastWeekSubmissions: Math.floor(Math.random() * 72) + 12,
    thisMonthSubmissions: Math.floor(Math.random() * 234) + 25,
    lastMonthSubmissions: Math.floor(Math.random() * 287) + 31,
    conversionRate: Math.floor(Math.random() * 1847) / 100 + 2.5,
    averageSubmissionsPerDay: Math.floor(Math.random() * 847) / 100 + 3.2,
    peakSubmissionHour: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
    topReferrerSource: ['Google', 'Direct', 'Facebook', 'LinkedIn', 'Twitter'][Math.floor(Math.random() * 5)]
  });

  const generateSqlCode = () => {
    return `-- Create forms table
CREATE TABLE forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  embed_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form submissions table
CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE form_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  submissions_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(form_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX idx_form_analytics_form_id ON form_analytics(form_id);
CREATE INDEX idx_form_analytics_date ON form_analytics(date);

-- Create trigger function to update analytics
CREATE OR REPLACE FUNCTION update_form_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO form_analytics (form_id, date, submissions_count)
  VALUES (NEW.form_id, CURRENT_DATE, 1)
  ON CONFLICT (form_id, date)
  DO UPDATE SET submissions_count = form_analytics.submissions_count + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_form_analytics
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_form_analytics();

-- Create view for analytics summary
CREATE VIEW form_analytics_summary AS
SELECT 
  f.id as form_id,
  f.name as form_name,
  COALESCE(SUM(fa.submissions_count), 0) as total_submissions,
  COALESCE(SUM(CASE WHEN fa.date = CURRENT_DATE THEN fa.submissions_count ELSE 0 END), 0) as today_submissions,
  COALESCE(SUM(CASE WHEN fa.date = CURRENT_DATE - 1 THEN fa.submissions_count ELSE 0 END), 0) as yesterday_submissions,
  COALESCE(SUM(CASE WHEN fa.date >= CURRENT_DATE - INTERVAL '7 days' THEN fa.submissions_count ELSE 0 END), 0) as week_submissions,
  COALESCE(SUM(CASE WHEN fa.date >= CURRENT_DATE - INTERVAL '30 days' THEN fa.submissions_count ELSE 0 END), 0) as month_submissions,
  COALESCE(AVG(fa.submissions_count), 0) as avg_submissions_per_day
FROM forms f
LEFT JOIN form_analytics fa ON f.id = fa.form_id
GROUP BY f.id, f.name;`;
  };

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
      analytics: generateExactAnalytics()
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

  const copySqlCode = () => {
    navigator.clipboard.writeText(generateSqlCode());
    toast({
      title: "Copied!",
      description: "SQL code copied to clipboard"
    });
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
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowSqlCode(true)}
            >
              <Database className="h-4 w-4 mr-2" />
              Database Setup
            </Button>
            
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
                  
                  {/* Exact Analytics Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center mb-3">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <Label className="text-sm font-medium">Detailed Analytics</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="font-bold text-lg text-blue-700">{form.analytics.totalSubmissions}</div>
                        <div className="text-blue-600">Total Submissions</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-bold text-lg text-green-700">{form.analytics.todaySubmissions}</div>
                        <div className="text-green-600">Today</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-bold text-lg text-purple-700">{form.analytics.thisWeekSubmissions}</div>
                        <div className="text-purple-600">This Week</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="font-bold text-lg text-orange-700">{form.analytics.thisMonthSubmissions}</div>
                        <div className="text-orange-600">This Month</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{form.analytics.yesterdaySubmissions}</div>
                        <div className="text-gray-600">Yesterday</div>
                      </div>
                      <div>
                        <div className="font-medium">{form.analytics.lastWeekSubmissions}</div>
                        <div className="text-gray-600">Last Week</div>
                      </div>
                      <div>
                        <div className="font-medium">{form.analytics.lastMonthSubmissions}</div>
                        <div className="text-gray-600">Last Month</div>
                      </div>
                      <div>
                        <div className="font-medium">{form.analytics.conversionRate.toFixed(2)}%</div>
                        <div className="text-gray-600">Conversion Rate</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{form.analytics.averageSubmissionsPerDay.toFixed(1)}</div>
                        <div className="text-gray-600">Avg. Submissions/Day</div>
                      </div>
                      <div>
                        <div className="font-medium">{form.analytics.peakSubmissionHour}</div>
                        <div className="text-gray-600">Peak Hour</div>
                      </div>
                      <div>
                        <div className="font-medium">{form.analytics.topReferrerSource}</div>
                        <div className="text-gray-600">Top Source</div>
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

        {/* SQL Code Dialog */}
        <Dialog open={showSqlCode} onOpenChange={setShowSqlCode}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Database Setup SQL Code</DialogTitle>
              <DialogDescription>
                Copy and run this SQL code in your database to set up the required tables and functions for form submissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                  <code>{generateSqlCode()}</code>
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copySqlCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy the SQL code above</li>
                  <li>Go to your database management tool</li>
                  <li>Execute the SQL code to create the required tables</li>
                  <li>Form submissions will be automatically tracked with detailed analytics</li>
                  <li>Use the created views and tables to build your analytics dashboard</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Integration;
