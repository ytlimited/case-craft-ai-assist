import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Shield, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="glass-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-orb floating-element absolute -top-24 -left-24"></div>
        <div className="glass-orb floating-element absolute top-1/2 -right-32"></div>
        <div className="glass-orb floating-element absolute bottom-0 left-1/3"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <Scale className="h-20 w-20 text-primary mx-auto mb-6 floating-element" />
            <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Wakeel.ai
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered legal assistance platform with <span className="text-primary font-semibold">ethical oversight</span>. 
            Generate comprehensive legal cases with advanced AI while maintaining the 
            <span className="text-primary font-semibold"> highest ethical standards</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="glass-button-primary text-lg px-8 py-4 rounded-2xl"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="glass-button-primary text-lg px-8 py-4 rounded-2xl"
                >
                  Get Started Free
                </Button>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="glass-button text-lg px-8 py-4 rounded-2xl"
                >
                  View Pricing
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Why Choose Wakeel.ai?
            </span>
          </h2>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto">
            Professional legal assistance with AI-powered insights and ethical compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card text-center border-0 rounded-3xl p-8">
            <CardHeader>
              <div className="relative inline-block mb-4">
                <Shield className="h-16 w-16 text-primary mx-auto" />
                <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full"></div>
              </div>
              <CardTitle className="text-2xl mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Ethical AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/70 text-lg leading-relaxed">
                Built-in ethical review system prevents misuse and ensures responsible legal assistance with every case generation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card text-center border-0 rounded-3xl p-8">
            <CardHeader>
              <div className="relative inline-block mb-4">
                <Zap className="h-16 w-16 text-primary mx-auto" />
                <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full"></div>
              </div>
              <CardTitle className="text-2xl mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Advanced Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/70 text-lg leading-relaxed">
                Comprehensive legal case generation with precedent research and strategic recommendations powered by cutting-edge AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card text-center border-0 rounded-3xl p-8 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="relative inline-block mb-4">
                <Users className="h-16 w-16 text-primary mx-auto" />
                <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full"></div>
              </div>
              <CardTitle className="text-2xl mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/70 text-lg leading-relaxed">
                Earn free cases by referring colleagues. Get 2 cases per referral, give 1 bonus case to your referrals
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card rounded-3xl p-12 text-center border-0">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Ready to Transform Your Legal Practice?
            </span>
          </h3>
          <p className="text-foreground/70 text-xl mb-8 leading-relaxed">
            Join thousands of legal professionals using AI-powered case generation with ethical oversight
          </p>
          {!user && (
            <Button 
              onClick={() => navigate('/auth')}
              className="glass-button-primary text-lg px-12 py-4 rounded-2xl"
            >
              Start Your Free Trial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
