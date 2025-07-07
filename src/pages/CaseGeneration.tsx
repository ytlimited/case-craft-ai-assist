import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Scale, AlertTriangle, Shield, CheckCircle, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import SimpleMode from '@/components/SimpleMode';
import PremiumMode from '@/components/PremiumMode';

const CASE_TYPES = [
  'Civil Litigation',
  'Criminal Defense',
  'Corporate Law',
  'Family Law',
  'Immigration Law',
  'Employment Law',
  'Real Estate Law',
  'Intellectual Property',
  'Contract Dispute',
  'Personal Injury',
];

const ETHICAL_KEYWORDS = [
  'murder', 'terrorism', 'fraud', 'money laundering', 'drug trafficking',
  'human trafficking', 'child abuse', 'domestic violence', 'extortion',
  'blackmail', 'kidnapping', 'assault', 'theft', 'burglary', 'robbery'
];

const CaseGeneration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [casesRemaining, setCasesRemaining] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [ethicalCheckPassed, setEthicalCheckPassed] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'simple' | 'premium'>('simple');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [currentConversation, setCurrentConversation] = useState('');
  const [generatedResult, setGeneratedResult] = useState('');
  const [isConversationMode, setIsConversationMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: '',
    additionalDetails: '',
  });

  useEffect(() => {
    fetchUserSubscription();
  }, [user]);

  const fetchUserSubscription = async () => {
    if (!user) return;

    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscription) {
        setCasesRemaining(subscription.cases_remaining);
        setUserPlan(subscription.plan);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const performEthicalCheck = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return !ETHICAL_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Perform real-time ethical check
    const allText = Object.values({ ...formData, [field]: value }).join(' ');
    setEthicalCheckPassed(performEthicalCheck(allText));
  };

  const generateCase = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to generate cases',
        variant: 'destructive',
      });
      return;
    }

    if (casesRemaining <= 0 && userPlan !== 'premium') {
      toast({
        title: 'No cases remaining',
        description: 'Please upgrade your plan to generate more cases',
        variant: 'destructive',
      });
      return;
    }

    if (!ethicalCheckPassed) {
      toast({
        title: 'Ethical Review Failed',
        description: 'Your case description contains potentially problematic content. Please review and modify.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const mode = userPlan === 'premium' ? 'premium' : 'simple';
      
      // Call Gemini AI via edge function
      const response = await supabase.functions.invoke('generate-case-ai', {
        body: {
          prompt: currentConversation || `Generate a legal case analysis for: ${formData.description}`,
          mode,
          conversationHistory,
          caseData: formData
        }
      });

      if (response.error) throw response.error;

      const { data } = response;
      
      if (mode === 'premium') {
        // Premium mode: Update conversation
        setConversationHistory(prev => [...prev, {
          role: 'assistant',
          content: data.content
        }]);
        
        if (data.isComplete) {
          setGeneratedResult(data.content);
        }
      } else {
        // Simple mode: Set result directly
        setGeneratedResult(data.content);
      }

      // Save case to database if complete
      if (data.isComplete || mode === 'simple') {
        const { error } = await supabase
          .from('cases')
          .insert({
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            case_type: formData.caseType,
            generated_content: data.content,
            ethical_review_passed: ethicalCheckPassed,
            tier_used: userPlan as 'free' | 'basic' | 'premium',
            interaction_mode: mode,
            conversation_history: conversationHistory
          });

        if (error) throw error;

        // Decrease cases remaining (except for premium unlimited)
        if (userPlan !== 'premium') {
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ cases_remaining: casesRemaining - 1 })
            .eq('user_id', user.id);

          if (updateError) throw updateError;
          setCasesRemaining(prev => prev - 1);
        }

        toast({
          title: 'Case Generated Successfully!',
          description: 'Your legal case analysis has been created.',
        });
      }

    } catch (error) {
      console.error('Error generating case:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set interaction mode based on user plan
    if (userPlan === 'premium') {
      setInteractionMode('premium');
    } else {
      setInteractionMode('simple');
    }
  }, [userPlan]);

  return (
    <div className="glass-background relative overflow-hidden min-h-screen">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-orb floating-element absolute -top-24 -left-24"></div>
        <div className="glass-orb floating-element absolute top-1/2 -right-32"></div>
        <div className="glass-orb floating-element absolute bottom-0 left-1/3"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <Scale className="h-16 w-16 text-primary mx-auto mb-6 floating-element" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Generate Legal Case
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            AI-powered legal case generation with ethical oversight and{' '}
            <span className="text-primary font-semibold">Google Gemini</span> intelligence
          </p>
        </div>

        {/* Plan Indicator */}
        <div className="flex justify-center mb-8">
          <Card className="glass-card border-0 rounded-2xl px-6 py-3">
            <div className="flex items-center space-x-3">
              {userPlan === 'premium' ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : (
                <Zap className="h-5 w-5 text-primary" />
              )}
              <span className="font-semibold">
                {userPlan === 'premium' ? 'Premium Plan' : 
                 userPlan === 'basic' ? 'Basic Plan' : 'Free Trial'}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {userPlan === 'premium' 
                  ? 'Interactive Chatbot Mode' 
                  : userPlan === 'basic' 
                    ? 'Enhanced Simple Mode'
                    : 'Simple Mode'
                }
              </span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {interactionMode === 'premium' ? (
              <PremiumMode
                formData={formData}
                setFormData={setFormData}
                onGenerate={generateCase}
                loading={loading}
                conversationHistory={conversationHistory}
                setConversationHistory={setConversationHistory}
                currentConversation={currentConversation}
                setCurrentConversation={setCurrentConversation}
                caseTypes={CASE_TYPES}
                generatedResult={generatedResult}
                setGeneratedResult={setGeneratedResult}
              />
            ) : (
              <SimpleMode
                formData={formData}
                setFormData={setFormData}
                onGenerate={generateCase}
                loading={loading}
                result={generatedResult}
                caseTypes={CASE_TYPES}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-primary">
                    {userPlan === 'premium' ? '∞' : casesRemaining}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userPlan === 'premium' ? 'Unlimited Cases' : 'Cases Remaining'}
                  </p>
                  <div className="text-xs text-muted-foreground bg-background/50 rounded-lg p-2">
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                  </div>
                  {casesRemaining <= 0 && userPlan !== 'premium' && (
                    <Button
                      onClick={() => navigate('/pricing')}
                      className="w-full glass-button-primary rounded-xl mt-3"
                      size="sm"
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 rounded-2xl border-yellow-200/50 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
                  <Shield className="h-5 w-5" />
                  <span>Ethical Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <p>• AI-powered by Google Gemini</p>
                  <p>• Ethical oversight on all generations</p>
                  <p>• Professional legal guidance</p>
                  <p>• Always consult qualified legal professionals</p>
                </div>
              </CardContent>
            </Card>

            {/* Ethical Check Status */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={ethicalCheckPassed}
                    disabled
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        Ethical Review
                      </span>
                      {ethicalCheckPassed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ethicalCheckPassed ? 'Passed' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!ethicalCheckPassed && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Content under review. Please ensure your case description is appropriate.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseGeneration;