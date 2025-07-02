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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Wakeel.ai
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-powered legal assistance platform with ethical oversight. Generate comprehensive legal cases 
            with advanced AI while maintaining the highest ethical standards.
          </p>
          <div className="space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="legal-button-primary text-lg px-8 py-3"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="legal-button-primary text-lg px-8 py-3"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="text-lg px-8 py-3"
                >
                  View Pricing
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose Wakeel.ai?
          </h2>
          <p className="text-muted-foreground text-lg">
            Professional legal assistance with AI-powered insights and ethical compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="legal-card text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Ethical AI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in ethical review system prevents misuse and ensures responsible legal assistance
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="legal-card text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Advanced Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive legal case generation with precedent research and strategic recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="legal-card text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Referral Program</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn free cases by referring colleagues. Get 2 cases per referral, give 1 bonus case
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
