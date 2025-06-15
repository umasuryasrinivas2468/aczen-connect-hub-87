
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  status: string;
  tags: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  stage: string;
  value: string;
  close_date: string;
  expected_close_date: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

interface Task {
  id: string;
  title: string;
  contact: string;
  due_date: string;
  priority: string;
  status: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

interface Communication {
  id: string;
  contact_id: string;
  contact_name: string;
  contact_company: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  timestamp: string;
  summary: string;
  notes: string;
  user_id: string;
  user_name: string;
  created_at: Date;
}

interface Meeting {
  id: string;
  title: string;
  contact_id: string;
  contact_name: string;
  date: Date;
  duration: number;
  description: string;
  meet_link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: Date;
}

interface DataContextType {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  templates: Template[];
  communications: Communication[];
  meetings: Meeting[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addTemplate: (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addCommunication: (communication: Omit<Communication, 'id' | 'created_at'>) => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'created_at' | 'meet_link'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    const contacts: Contact[] = data ? data.map(contact => ({
      ...contact,
      created_at: new Date(contact.created_at),
      updated_at: new Date(contact.updated_at)
    })) : [];

    console.log('Contacts fetched successfully:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

export const fetchDeals = async (): Promise<Deal[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }

    const deals: Deal[] = data ? data.map(deal => ({
      ...deal,
      created_at: new Date(deal.created_at),
      updated_at: new Date(deal.updated_at)
    })) : [];

    console.log('Deals fetched successfully:', deals);
    return deals;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    const tasks: Task[] = data ? data.map(task => ({
      ...task,
      created_at: new Date(task.created_at),
      updated_at: new Date(task.updated_at)
    })) : [];

    console.log('Tasks fetched successfully:', tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }

    const templates: Template[] = data ? data.map(template => ({
      ...template,
      created_at: new Date(template.created_at),
      updated_at: new Date(template.updated_at)
    })) : [];

    console.log('Templates fetched successfully:', templates);
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

const fetchCommunications = async (): Promise<Communication[]> => {
  try {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      throw error;
    }

    const communications: Communication[] = data ? data.map(comm => ({
      ...comm,
      created_at: new Date(comm.created_at),
    })) : [];

    console.log('Communications fetched successfully:', communications);
    return communications;
  } catch (error) {
    console.error('Error fetching communications:', error);
    return [];
  }
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;

      const newContact = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setContacts(prev => [newContact, ...prev]);
      console.log('Contact added successfully:', newContact);
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([deal])
        .select()
        .single();

      if (error) throw error;

      const newDeal = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setDeals(prev => [newDeal, ...prev]);
      console.log('Deal added successfully:', newDeal);
    } catch (error) {
      console.error('Error adding deal:', error);
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setTasks(prev => [newTask, ...prev]);
      console.log('Task added successfully:', newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const addTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      const newTemplate = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setTemplates(prev => [newTemplate, ...prev]);
      console.log('Template added successfully:', newTemplate);
    } catch (error) {
      console.error('Error adding template:', error);
      throw error;
    }
  };

  const addCommunication = async (communication: Omit<Communication, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert([communication])
        .select()
        .single();

      if (error) throw error;

      const newCommunication = {
        ...data,
        created_at: new Date(data.created_at),
      };

      setCommunications(prev => [newCommunication, ...prev]);
      console.log('Communication added successfully:', newCommunication);
    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  };

  const fetchMeetings = async (): Promise<Meeting[]> => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          contacts(name, company)
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }

      const meetings = data?.map(meeting => ({
        ...meeting,
        date: new Date(meeting.date),
        created_at: new Date(meeting.created_at),
        contact_name: meeting.contacts ? `${meeting.contacts.name} - ${meeting.contacts.company}` : 'Unknown Contact'
      })) || [];

      console.log('Meetings fetched successfully:', meetings);
      return meetings;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  };

  const refreshData = async () => {
    console.log('Starting data refresh...');
    setLoading(true);
    
    try {
      const [contactsData, dealsData, tasksData, templatesData, communicationsData, meetingsData] = await Promise.all([
        fetchContacts(),
        fetchDeals(),
        fetchTasks(),
        fetchTemplates(),
        fetchCommunications(),
        fetchMeetings()
      ]);

      setContacts(contactsData);
      setDeals(dealsData);
      setTasks(tasksData);
      setTemplates(templatesData);
      setCommunications(communicationsData);
      setMeetings(meetingsData);
      console.log('Data refresh completed successfully');
    } catch (error) {
      console.error('Error during data refresh:', error);
    } finally {
      setLoading(false);
      console.log('Data refresh finished, loading set to false');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'meet_link'>) => {
    try {
      const meetingWithLink = {
        ...meetingData,
        meet_link: `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`,
        date: meetingData.date.toISOString(),
      };

      const { data, error } = await supabase
        .from('meetings')
        .insert([meetingWithLink])
        .select()
        .single();

      if (error) throw error;

      const newMeeting = {
        ...data,
        date: new Date(data.date),
        created_at: new Date(data.created_at),
      };

      setMeetings(prev => [newMeeting, ...prev]);
      console.log('Meeting added successfully:', newMeeting);
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  };

  const contextValue: DataContextType = {
    contacts,
    deals,
    tasks,
    templates,
    communications,
    meetings,
    loading,
    refreshData,
    addContact,
    addDeal,
    addTask,
    addTemplate,
    addCommunication,
    addMeeting,
  };

  console.log('DataProvider providing context with:', {
    contactsCount: contacts.length,
    dealsCount: deals.length,
    tasksCount: tasks.length,
    templatesCount: templates.length,
    meetingsCount: meetings.length,
    loading
  });

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
