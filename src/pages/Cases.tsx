import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Calendar, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Case {
  id: string;
  title: string;
  description: string;
  case_type: string;
  generated_content: string;
  ethical_review_passed: boolean;
  tier_used: string;
  created_at: string;
}

const Cases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cases',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.case_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCase = (case_: Case) => {
    const content = case_.generated_content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${case_.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: 'Downloaded!',
      description: 'Case has been downloaded successfully',
    });
  };

  const viewCase = (case_: Case) => {
    setSelectedCase(case_);
  };

  if (!user) {
    return (
      <div className="glass-background min-h-screen flex items-center justify-center">
        <Card className="glass-card rounded-3xl p-8 text-center border-0 max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Authentication Required</CardTitle>
            <CardDescription className="text-lg">
              Please sign in to view your cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="glass-button-primary rounded-xl">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-orb w-16 h-16 mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading your cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-background min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-orb floating-element absolute -top-24 -right-24"></div>
        <div className="glass-orb floating-element absolute bottom-1/3 -left-32"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedCase ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  My Legal Cases
                </span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Manage and review all your AI-generated legal cases
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-4 w-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-0 rounded-xl"
                />
              </div>
              <Button
                onClick={() => navigate('/generate-case')}
                className="glass-button-primary rounded-xl px-6 py-3"
              >
                Generate New Case
              </Button>
            </div>

            {/* Cases Grid */}
            {filteredCases.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-24 w-24 text-foreground/20 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground/70">
                  {searchTerm ? 'No cases match your search' : 'No cases yet'}
                </h3>
                <p className="text-foreground/50 mb-8">
                  {searchTerm ? 'Try adjusting your search terms' : 'Generate your first legal case to get started'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => navigate('/generate-case')}
                    className="glass-button-primary rounded-xl px-8 py-3"
                  >
                    Generate Your First Case
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((case_) => (
                  <Card key={case_.id} className="glass-card border-0 rounded-3xl overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge
                            variant="secondary"
                            className="mb-3 bg-primary/10 text-primary border-0"
                          >
                            {case_.case_type}
                          </Badge>
                          <CardTitle className="text-lg mb-2 line-clamp-2">{case_.title}</CardTitle>
                        </div>
                        <Badge
                          variant={case_.ethical_review_passed ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {case_.ethical_review_passed ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3 text-foreground/70">
                        {case_.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-sm text-foreground/60">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(case_.created_at).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {case_.tier_used.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => viewCase(case_)}
                          variant="outline"
                          size="sm"
                          className="flex-1 glass-button rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={() => downloadCase(case_)}
                          variant="outline"
                          size="sm"
                          className="flex-1 glass-button rounded-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Case Detail View */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                onClick={() => setSelectedCase(null)}
                className="glass-button rounded-xl mb-4"
              >
                ← Back to Cases
              </Button>
              <h1 className="text-3xl font-bold mb-2">{selectedCase.title}</h1>
              <div className="flex items-center space-x-4 text-foreground/60">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  {selectedCase.case_type}
                </Badge>
                <span>{new Date(selectedCase.created_at).toLocaleDateString()}</span>
                <Badge variant={selectedCase.ethical_review_passed ? 'default' : 'destructive'}>
                  {selectedCase.ethical_review_passed ? 'Ethically Approved' : 'Pending Review'}
                </Badge>
              </div>
            </div>

            <Card className="glass-card border-0 rounded-3xl">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed">
                    {selectedCase.generated_content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => downloadCase(selectedCase)}
                className="glass-button-primary rounded-xl px-8 py-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Case
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;