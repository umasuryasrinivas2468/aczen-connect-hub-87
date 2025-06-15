
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, CheckSquare, Plus, Calendar, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Contacts",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Deals",
      value: "24",
      change: "+8%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Revenue Forecast",
      value: "₹4,56,789",
      change: "+23%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Tasks Due",
      value: "12",
      change: "-4%",
      changeType: "negative" as const,
      icon: CheckSquare,
    },
  ];

  const recentDeals = [
    { name: "Acme Corp", value: "₹2,50,000", stage: "Proposal", priority: "high" },
    { name: "Tech Solutions", value: "₹1,80,000", stage: "Negotiation", priority: "medium" },
    { name: "Global Industries", value: "₹3,20,000", stage: "Contacted", priority: "high" },
  ];

  const upcomingTasks = [
    { title: "Follow up with Acme Corp", due: "Today", priority: "high" },
    { title: "Send proposal to Tech Solutions", due: "Tomorrow", priority: "medium" },
    { title: "Schedule demo call", due: "Dec 18", priority: "low" },
  ];

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
              <div className="space-y-4">
                {recentDeals.map((deal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium text-gray-900">{deal.name}</div>
                      <div className="text-sm text-gray-500">{deal.stage}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{deal.value}</div>
                      <Badge 
                        variant={deal.priority === "high" ? "destructive" : deal.priority === "medium" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {deal.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.due}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
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
