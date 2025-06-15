
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string;
  notes: string;
  status: string;
  createdAt: Date;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: string;
  stage: string;
  notes: string;
  expectedCloseDate: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  contact: string;
  status: string;
  createdAt: Date;
}

interface DataContextType {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      contacts,
      deals,
      tasks,
      addContact,
      addDeal,
      addTask,
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
