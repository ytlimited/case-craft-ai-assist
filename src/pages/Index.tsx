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
    <div className="modern-background">
      {/* Hero Section */}
      <div className="modern-hero">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white modern-heading">
              The New Standard
              <br />
              for Legal AI
            </h1>
            
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto modern-text">
              AI-powered legal assistance platform with ethical oversight. 
              Generate comprehensive legal cases with advanced AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="modern-button-primary text-lg px-12 py-4"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="modern-button-primary text-lg px-12 py-4"
                  >
                    Get Started
                  </Button>
                  <Button 
                    onClick={() => navigate('/pricing')}
                    className="modern-button text-lg px-12 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground modern-heading">
            A Purpose Built
            <br />
            Legal AI Platform
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto modern-text">
            Built by legal professionals, for legal professionals. Experience the future of legal assistance with our advanced AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="modern-card p-8">
            <CardHeader className="pb-6">
              <Shield className="h-16 w-16 text-primary mb-6" />
              <CardTitle className="text-2xl font-semibold text-foreground modern-subheading">
                Ethical AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-lg modern-text">
                Built-in ethical review system prevents misuse and ensures responsible legal assistance with every generation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="modern-card p-8">
            <CardHeader className="pb-6">
              <Zap className="h-16 w-16 text-primary mb-6" />
              <CardTitle className="text-2xl font-semibold text-foreground modern-subheading">
                Advanced Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-lg modern-text">
                Comprehensive legal case generation with precedent research and strategic recommendations powered by cutting-edge AI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="modern-card p-8">
            <CardHeader className="pb-6">
              <Users className="h-16 w-16 text-primary mb-6" />
              <CardTitle className="text-2xl font-semibold text-foreground modern-subheading">
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-lg modern-text">
                Earn free cases by referring colleagues. Get 2 additional cases for every successful referral to our platform.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-foreground">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h3 className="text-5xl md:text-6xl font-bold mb-8 text-white modern-heading">
              A Modern Stack for
              <br />
              Modern Legal Firms
            </h3>
            <p className="text-white/80 text-xl mb-12 max-w-3xl mx-auto modern-text">
              Join thousands of legal professionals who are already transforming their practice with our AI-powered platform.
            </p>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="modern-button-primary text-lg px-12 py-4"
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
