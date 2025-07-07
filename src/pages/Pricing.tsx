import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWhatsAppSubscribe = (plan: string) => {
    const message = `Hello Admin, I want to subscribe to ${plan} plan. My account email is: ${user?.email || 'Not logged in'}`;
    const whatsappUrl = `https://wa.me/923284645753?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '7 days',
      description: 'Simple Mode - One input, complete output',
      cases: '3 cases',
      mode: 'Simple Mode',
      modeDescription: 'Single input box → Complete analysis output. Copy-only results.',
      features: [
        '3 case generations',
        'Basic legal analysis',
        'Simple input interface',
        'Copy results only',
        'Ethical oversight',
        'Email support'
      ],
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      current: true
    },
    {
      name: 'Basic Plan',
      price: '$29',
      period: 'month',
      description: 'Enhanced Simple Mode with better quality',
      cases: '30 cases/month',
      mode: 'Enhanced Simple Mode',
      modeDescription: 'Faster processing, better analysis quality. Copy-only results.',
      features: [
        '30 cases per month',
        'Advanced legal analysis',
        'Faster AI processing',
        'Copy results only',
        'Priority ethical review',
        'Priority support',
        'Case templates'
      ],
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      popular: true
    },
    {
      name: 'Premium',
      price: '$99',
      period: 'month',
      description: 'Interactive Chatbot Mode for personalized cases',
      cases: 'Unlimited cases',
      mode: 'Interactive Chatbot Mode',
      modeDescription: 'AI asks follow-up questions for personalized cases. Full editing capabilities.',
      features: [
        'Unlimited case generation',
        'Interactive AI consultation',
        'AI asks follow-up questions',
        'Edit & customize results',
        'Add new information',
        'Personalized legal advice',
        '24/7 premium support',
        'API access',
        'Custom integrations'
      ],
      icon: Star,
      color: 'from-amber-500 to-orange-600',
      enterprise: true
    }
  ];

  return (
    <div className="glass-background relative overflow-hidden min-h-screen">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-orb floating-element absolute -top-24 -right-24"></div>
        <div className="glass-orb floating-element absolute bottom-1/3 -left-32"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Select the perfect plan for your legal practice. All plans include ethical oversight and premium support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`glass-card border-0 rounded-3xl relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-8' : 'pt-6'}`}>
                  <div className="relative inline-block mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 blur-lg bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-2xl"></div>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-foreground/60">/{plan.period}</span>
                  </div>
                  
                  <div className={`mb-4 p-3 rounded-lg border ${
                    plan.name === 'Free Trial' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                    plan.name === 'Basic Plan' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' :
                    'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    <h4 className={`font-semibold mb-1 ${
                      plan.name === 'Free Trial' ? 'text-blue-800 dark:text-blue-200' :
                      plan.name === 'Basic Plan' ? 'text-purple-800 dark:text-purple-200' :
                      'text-amber-800 dark:text-amber-200'
                    }`}>{plan.mode}</h4>
                    <p className={`text-sm ${
                      plan.name === 'Free Trial' ? 'text-blue-700 dark:text-blue-300' :
                      plan.name === 'Basic Plan' ? 'text-purple-700 dark:text-purple-300' :
                      'text-amber-700 dark:text-amber-300'
                    }`}>{plan.modeDescription}</p>
                  </div>
                  
                  <CardDescription className="text-foreground/70 text-lg">
                    {plan.description}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-0">
                    {plan.cases}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {plan.name === 'Free' ? (
                      user ? (
                        <Button
                          onClick={() => navigate('/dashboard')}
                          className="w-full glass-button rounded-xl py-3"
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/auth')}
                          className="w-full glass-button-primary rounded-xl py-3"
                        >
                          Get Started Free
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleWhatsAppSubscribe(plan.name)}
                        className="w-full glass-button-primary rounded-xl py-3"
                      >
                        Contact Admin
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* WhatsApp Contact Info */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 text-center border-0">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Need Help Choosing?
              </span>
            </h3>
            <p className="text-foreground/70 mb-6 text-lg">
              Contact our admin team via WhatsApp for personalized assistance and enterprise solutions.
            </p>
            <Button
              onClick={() => handleWhatsAppSubscribe('consultation')}
              className="glass-button-primary rounded-xl px-8 py-3"
            >
              Chat with Admin
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 border-0">
              <h4 className="font-semibold text-lg mb-3 text-primary">How does billing work?</h4>
              <p className="text-foreground/70">
                All subscriptions are managed through WhatsApp contact with our admin team. We'll set up your billing cycle after confirmation.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border-0">
              <h4 className="font-semibold text-lg mb-3 text-primary">Can I change plans anytime?</h4>
              <p className="text-foreground/70">
                Yes! Contact our admin team via WhatsApp to upgrade or downgrade your plan at any time.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border-0">
              <h4 className="font-semibold text-lg mb-3 text-primary">What's included in the referral program?</h4>
              <p className="text-foreground/70">
                Refer a colleague and get 2 free cases. Your referral gets 1 bonus case. Available on all plans.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border-0">
              <h4 className="font-semibold text-lg mb-3 text-primary">Is there a free trial?</h4>
              <p className="text-foreground/70">
                Yes! Every new user gets 2 complimentary cases to try our platform before upgrading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;