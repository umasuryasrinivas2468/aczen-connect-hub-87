
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Loader2 } from "lucide-react";
import { useState } from "react";
import NewTaskForm from "@/components/forms/NewTaskForm";
import { useData } from "@/contexts/DataContext";

const Tasks = () => {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const { tasks, loading, updateTaskStatus } = useData();

  const taskStats = {
    pending: tasks.filter(task => task.status === "Pending").length,
    dueToday: tasks.filter(task => {
      if (!task.due_date) return false;
      const today = new Date().toDateString();
      return new Date(task.due_date).toDateString() === today;
    }).length,
    completed: tasks.filter(task => task.status === "Completed").length,
  };

  const handleStatusClick = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading tasks...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Tasks & Reminders</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and stay on top of follow-ups</p>
          </div>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <NewTaskForm onClose={() => setIsNewTaskOpen(false)} />
          </Dialog>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{taskStats.pending}</div>
              <p className="text-xs text-gray-500">Active tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{taskStats.dueToday}</div>
              <p className="text-xs text-gray-500">Tasks due today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
              <p className="text-xs text-gray-500">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>Your task list with priorities and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <CheckSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-gray-400 mb-6">Stay organized by creating your first task</p>
                <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </DialogTrigger>
                  <NewTaskForm onClose={() => setIsNewTaskOpen(false)} />
                </Dialog>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.contact && (
                        <p className="text-xs text-gray-500 mt-1">Contact: {task.contact}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <Badge 
                        variant={task.status === 'Completed' ? 'default' : 'outline'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleStatusClick(task.id, task.status)}
                        title="Click to toggle status"
                      >
                        {task.status}
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tasks;
