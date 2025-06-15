
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, BarChart3, CheckCircle, Star, Zap } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold text-white">Aczen</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton>
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/30">
            🚀 Modern CRM Solution
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Customer Relations
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your sales process, manage contacts effortlessly, and close more deals with our intelligent CRM platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Grow Your Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Contact Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Organize and manage all your contacts and companies in one place
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Sales Pipeline</CardTitle>
                <CardDescription className="text-gray-300">
                  Visual Kanban board to track leads through your sales process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Task Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Never miss a follow-up with integrated task and reminder system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Zap className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">AI Assistant</CardTitle>
                <CardDescription className="text-gray-300">
                  Get intelligent suggestions and auto-generated content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Star className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Email Templates</CardTitle>
                <CardDescription className="text-gray-300">
                  Save time with reusable templates and AI-powered suggestions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Building2 className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Track performance with detailed reports and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <CardDescription className="text-gray-300">Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold text-white mt-4">₹0<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Up to 10 contacts</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Basic pipeline</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Task management</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Email support</li>
                </ul>
                <SignUpButton>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <CardDescription className="text-gray-300">For growing businesses</CardDescription>
                <div className="text-3xl font-bold text-white mt-4">₹799<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Unlimited contacts</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Advanced pipeline</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />AI features</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Team collaboration</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Priority support</li>
                </ul>
                <SignUpButton>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Start Pro Trial
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LandingPage;
