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
    <div className="clean-background">
      {/* Hero Section */}
      <div className="clean-hero">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="mb-8">
              <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-gray-800">
              Wakeel.ai
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light">
              AI-powered legal assistance platform with ethical oversight. 
              Generate comprehensive legal cases with advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="clean-button-primary text-base px-8 py-3"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="clean-button-primary text-base px-8 py-3"
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    onClick={() => navigate('/pricing')}
                    className="clean-button text-base px-8 py-3"
                  >
                    View Pricing
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-800">
            Why Choose Wakeel.ai?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Professional legal assistance with AI-powered insights and ethical compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="clean-card p-8 text-center">
            <CardHeader className="pb-4">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-medium text-gray-800">
                Ethical AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                Built-in ethical review system prevents misuse and ensures responsible legal assistance
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="clean-card p-8 text-center">
            <CardHeader className="pb-4">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-medium text-gray-800">
                Advanced Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                Comprehensive legal case generation with precedent research and strategic recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="clean-card p-8 text-center">
            <CardHeader className="pb-4">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-medium text-gray-800">
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-light">
                Earn free cases by referring colleagues. Get 2 cases per referral
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-light mb-6 text-gray-800">
              Ready to Transform Your Legal Practice?
            </h3>
            <p className="text-gray-600 text-lg mb-8 font-light max-w-2xl mx-auto">
              Join thousands of legal professionals using AI-powered case generation
            </p>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="clean-button-primary text-base px-12 py-3"
              >
                Start Your Free Trial
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
