import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleModeProps {
  formData: {
    title: string;
    description: string;
    caseType: string;
    additionalDetails: string;
  };
  setFormData: (data: any) => void;
  onGenerate: () => void;
  loading: boolean;
  result: string;
  caseTypes: string[];
}

const SimpleMode: React.FC<SimpleModeProps> = ({
  formData,
  setFormData,
  onGenerate,
  loading,
  result,
  caseTypes
}) => {
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copied!',
      description: 'Case analysis copied to clipboard',
    });
  };

  if (result) {
    return (
      <Card className="glass-card border-0 rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Generated Case Analysis
              </CardTitle>
              <CardDescription>Your legal case analysis is ready</CardDescription>
            </div>
            <Button
              onClick={copyToClipboard}
              className="glass-button rounded-xl"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 rounded-xl p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-mono">
              {result}
            </pre>
          </div>
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              className="glass-button-primary rounded-xl"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate New Case
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Simple Mode
        </CardTitle>
        <CardDescription>
          Fill in your case details and get a complete legal analysis in one go
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="description" className="text-lg font-medium">
            Describe Your Legal Case *
          </Label>
          <Textarea
            id="description"
            placeholder={`Please provide complete details about your legal case including:

• Case Title/Subject
• Type of case (e.g., Civil Litigation, Criminal Defense, Family Law, etc.)
• Detailed description of the situation
• Key facts and circumstances
• Any relevant dates, parties involved
• Additional details or concerns
• What outcome you're seeking

Example:
"Employment Law - Wrongful Termination
I was terminated from my position as Marketing Manager at XYZ Corp on January 15th, 2024. I believe this was due to my recent pregnancy announcement rather than performance issues. I had excellent reviews and recently received a promotion. The company cited 'restructuring' but hired a replacement within two weeks..."

Be as detailed as possible for the best legal analysis.`}
            rows={16}
            value={formData.description}
            onChange={(e) => {
              handleInputChange('description', e.target.value);
              // Auto-extract title and case type from description if possible
              const lines = e.target.value.split('\n');
              if (lines[0] && !formData.title) {
                handleInputChange('title', lines[0].substring(0, 100));
              }
            }}
            className="text-sm leading-relaxed"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !formData.description.trim()}
          className="w-full glass-button-primary py-3"
        >
          {loading ? 'Generating Case Analysis...' : 'Generate Legal Case Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleMode;