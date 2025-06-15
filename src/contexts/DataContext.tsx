
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string;
  notes: string;
  status: string;
  created_at: Date;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: string;
  stage: string;
  notes: string;
  expected_close_date: string;
  created_at: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  contact: string;
  status: string;
  created_at: Date;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  created_at: Date;
}

interface DataContextType {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  templates: Template[];
  loading: boolean;
  addContact: (contact: Omit<Contact, 'id' | 'created_at'>) => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'created_at'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  addTemplate: (template: Omit<Template, 'id' | 'created_at'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    console.log('Fetching contacts...');
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return;
    }

    setContacts(data.map(contact => ({
      ...contact,
      created_at: new Date(contact.created_at)
    })));
    console.log('Contacts fetched:', data);
  };

  const fetchDeals = async () => {
    console.log('Fetching deals...');
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      return;
    }

    setDeals(data.map(deal => ({
      ...deal,
      value: deal.value?.toString() || '0',
      expected_close_date: deal.expected_close_date || '',
      created_at: new Date(deal.created_at)
    })));
    console.log('Deals fetched:', data);
  };

  const fetchTasks = async () => {
    console.log('Fetching tasks...');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    setTasks(data.map(task => ({
      ...task,
      due_date: task.due_date || '',
      created_at: new Date(task.created_at)
    })));
    console.log('Tasks fetched:', data);
  };

  const fetchTemplates = async () => {
    console.log('Fetching templates...');
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return;
    }

    setTemplates(data.map(template => ({
      ...template,
      created_at: new Date(template.created_at)
    })));
    console.log('Templates fetched:', data);
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchContacts(),
      fetchDeals(),
      fetchTasks(),
      fetchTemplates()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    console.log('Adding contact:', contactData);
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Error adding contact:', error);
      throw error;
    }

    const newContact = {
      ...data,
      created_at: new Date(data.created_at)
    };
    
    setContacts(prev => [newContact, ...prev]);
    console.log('Contact added:', newContact);
  };

  const addDeal = async (dealData: Omit<Deal, 'id' | 'created_at'>) => {
    console.log('Adding deal:', dealData);
    const dealToInsert = {
      ...dealData,
      value: dealData.value ? parseFloat(dealData.value) : 0,
      expected_close_date: dealData.expected_close_date || null
    };

    const { data, error } = await supabase
      .from('deals')
      .insert([dealToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error adding deal:', error);
      throw error;
    }

    const newDeal = {
      ...data,
      value: data.value?.toString() || '0',
      expected_close_date: data.expected_close_date || '',
      created_at: new Date(data.created_at)
    };
    
    setDeals(prev => [newDeal, ...prev]);
    console.log('Deal added:', newDeal);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    console.log('Adding task:', taskData);
    const taskToInsert = {
      ...taskData,
      due_date: taskData.due_date || null
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }

    const newTask = {
      ...data,
      due_date: data.due_date || '',
      created_at: new Date(data.created_at)
    };
    
    setTasks(prev => [newTask, ...prev]);
    console.log('Task added:', newTask);
  };

  const addTemplate = async (templateData: Omit<Template, 'id' | 'created_at'>) => {
    console.log('Adding template:', templateData);
    const { data, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select()
      .single();

    if (error) {
      console.error('Error adding template:', error);
      throw error;
    }

    const newTemplate = {
      ...data,
      created_at: new Date(data.created_at)
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    console.log('Template added:', newTemplate);
  };

  return (
    <DataContext.Provider value={{
      contacts,
      deals,
      tasks,
      templates,
      loading,
      addContact,
      addDeal,
      addTask,
      addTemplate,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
