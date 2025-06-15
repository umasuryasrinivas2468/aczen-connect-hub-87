
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, BarChart3, CheckCircle, Star, Zap } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-gray-200">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">Aczen</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton>
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
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
      <section className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            🚀 Modern CRM Solution
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {" "}Customer Relations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your sales process, manage contacts effortlessly, and close more deals with our intelligent CRM platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything You Need to Grow Your Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">Contact Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Organize and manage all your contacts and companies in one place
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">Sales Pipeline</CardTitle>
                <CardDescription className="text-gray-600">
                  Visual Kanban board to track leads through your sales process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">Task Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Never miss a follow-up with integrated task and reminder system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Zap className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">AI Assistant</CardTitle>
                <CardDescription className="text-gray-600">
                  Get intelligent suggestions and auto-generated content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Star className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">Email Templates</CardTitle>
                <CardDescription className="text-gray-600">
                  Save time with reusable templates and AI-powered suggestions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Building2 className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-gray-900">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  Track performance with detailed reports and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-2xl">Free</CardTitle>
                <CardDescription className="text-gray-600">Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">₹0<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Up to 10 contacts</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Basic pipeline</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Task management</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Email support</li>
                </ul>
                <SignUpButton>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-200 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-gray-900 text-2xl">Pro</CardTitle>
                <CardDescription className="text-gray-600">For growing businesses</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">₹799<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Unlimited contacts</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Advanced pipeline</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />AI features</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Team collaboration</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Priority support</li>
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
    </div>
  );
};

export default LandingPage;
