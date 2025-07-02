import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Scale, Users, FileText, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserStats {
  casesRemaining: number;
  totalCases: number;
  plan: string;
  referralCode: string;
  referralCount: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch subscription info
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch cases count
      const { count: casesCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      // Fetch referrals count
      const { count: referralCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_user_id', user?.id);

      setStats({
        casesRemaining: subscription?.cases_remaining || 0,
        totalCases: casesCount || 0,
        plan: subscription?.plan || 'free',
        referralCode: user?.id?.slice(-8) || '',
        referralCount: referralCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSubscribe = (plan: string) => {
    const message = `Hello Admin, I want to subscribe to ${plan} plan. My account email is: ${user?.email}`;
    const whatsappUrl = `https://wa.me/923284645753?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(stats?.referralCode || '');
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Badge variant={stats?.plan === 'premium' ? 'default' : 'secondary'} className="text-sm">
          {stats?.plan?.toUpperCase()} PLAN
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="legal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases Remaining</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.casesRemaining}</div>
            <Progress value={(stats?.casesRemaining || 0) * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCases}</div>
            <p className="text-xs text-muted-foreground">Generated so far</p>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.referralCount}</div>
            <p className="text-xs text-muted-foreground">Friends referred</p>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats?.plan}</div>
            <p className="text-xs text-muted-foreground">Your subscription</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="legal-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your legal assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/generate-case')}
              className="w-full legal-button-primary"
              disabled={!stats?.casesRemaining}
            >
              Generate New Case
            </Button>
            <Button 
              onClick={() => navigate('/cases')}
              variant="outline"
              className="w-full"
            >
              View My Cases
            </Button>
            <Button 
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="w-full"
            >
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Invite friends and earn free cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
              <div className="flex items-center space-x-2">
                <code className="bg-muted px-3 py-1 rounded text-sm font-mono">
                  {stats?.referralCode}
                </code>
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• You get 2 free cases for each referral</p>
              <p>• Your friend gets 1 extra case</p>
              <p>• Share your code with lawyer friends</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats?.plan === 'free' && (
        <Card className="legal-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Upgrade Your Plan</CardTitle>
            <CardDescription>
              Unlock more features and generate unlimited cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => handleWhatsAppSubscribe('Basic')}
                variant="outline"
                className="w-full"
              >
                Basic Plan - Contact Admin
              </Button>
              <Button 
                onClick={() => handleWhatsAppSubscribe('Premium')}
                className="w-full legal-button-primary"
              >
                Premium Plan - Contact Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;