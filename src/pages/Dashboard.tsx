import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, CheckSquare, Plus, Calendar, ArrowUpRight, Loader2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const Dashboard = () => {
  const { contacts, deals, tasks, loading } = useData();
  
  // Calculate actual stats
  const totalRevenue = deals
    .filter(deal => deal.stage === "Won")
    .reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
    
  const pendingTasks = tasks.filter(task => task.status === "Pending").length;
  const activeDeals = deals.filter(deal => deal.stage !== "Won").length;

  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length.toString(),
      change: "0%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Deals",
      value: activeDeals.toString(),
      change: "0%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Revenue Won",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "0%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Tasks Due",
      value: pendingTasks.toString(),
      change: "0%",
      changeType: "positive" as const,
      icon: CheckSquare,
    },
  ];

  const recentDeals = deals.slice(0, 5);
  const upcomingTasks = tasks.filter(task => task.status === "Pending").slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Contact
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <Badge 
                    variant={stat.changeType === "positive" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                    )}
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Deals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Deals
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>
                Your most recent sales opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDeals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No deals yet</p>
                  <p className="text-sm">Start by creating your first deal</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{deal.title}</p>
                        <p className="text-sm text-gray-600">{deal.contact}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{parseFloat(deal.value || '0').toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Tasks
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>
                Tasks that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No tasks scheduled</p>
                  <p className="text-sm">Add tasks to stay organized</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.contact}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={task.priority === 'High' ? 'destructive' : 'outline'} className="text-xs">
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions to help you stay productive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Add Contact
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                Create Deal
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <CheckSquare className="h-6 w-6 mb-2" />
                Add Task
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
