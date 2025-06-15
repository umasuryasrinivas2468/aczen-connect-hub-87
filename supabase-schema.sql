
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    tags TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    contact TEXT NOT NULL,
    stage TEXT NOT NULL,
    value TEXT NOT NULL,
    close_date TEXT NOT NULL,
    expected_close_date TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    contact TEXT NOT NULL,
    due_date TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contact_id TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_company TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
    timestamp TEXT NOT NULL,
    summary TEXT NOT NULL,
    notes TEXT DEFAULT '',
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive meetings table with all details
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    contact_id TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    contact_company TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER NOT NULL DEFAULT 60,
    timezone TEXT DEFAULT 'UTC',
    location TEXT,
    meeting_type TEXT NOT NULL DEFAULT 'virtual' CHECK (meeting_type IN ('virtual', 'in-person', 'phone')),
    description TEXT DEFAULT '',
    agenda TEXT DEFAULT '',
    objectives TEXT DEFAULT '',
    meet_link TEXT,
    meeting_room TEXT,
    dial_in_number TEXT,
    passcode TEXT,
    host_name TEXT,
    host_email TEXT,
    attendees TEXT DEFAULT '', -- JSON array as text or comma-separated
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    recurring_type TEXT CHECK (recurring_type IN ('none', 'daily', 'weekly', 'biweekly', 'monthly')),
    recurring_until DATE,
    parent_meeting_id UUID REFERENCES meetings(id),
    reminder_sent BOOLEAN DEFAULT false,
    reminder_time INTEGER DEFAULT 15, -- minutes before meeting
    notes TEXT DEFAULT '',
    outcome TEXT DEFAULT '',
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    recording_link TEXT,
    documents TEXT DEFAULT '', -- JSON array as text or comma-separated file URLs
    tags TEXT DEFAULT '',
    cost DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    created_by TEXT,
    updated_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for meetings to contacts
ALTER TABLE meetings 
ADD CONSTRAINT fk_meetings_contact 
FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_contact_id ON meetings(contact_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_type ON meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_priority ON meetings(priority);
CREATE INDEX IF NOT EXISTS idx_meetings_host_email ON meetings(host_email);
CREATE INDEX IF NOT EXISTS idx_communications_contact_id ON communications(contact_id);
CREATE INDEX IF NOT EXISTS idx_communications_timestamp ON communications(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - you can restrict these later)
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on deals" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on templates" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on communications" ON communications FOR ALL USING (true);
CREATE POLICY "Allow all operations on meetings" ON meetings FOR ALL USING (true);
