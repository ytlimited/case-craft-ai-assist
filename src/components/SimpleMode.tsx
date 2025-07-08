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
      <Card className="modern-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground modern-subheading">
                Generated Case Analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground modern-text">Your legal case analysis is ready</CardDescription>
            </div>
            <Button
              onClick={copyToClipboard}
              className="modern-button"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-xl p-8 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed modern-text">
              {result}
            </pre>
          </div>
          <div className="mt-8">
            <Button
              onClick={() => window.location.reload()}
              className="modern-button-primary"
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
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground modern-subheading">
          Legal Case Analysis
        </CardTitle>
        <CardDescription className="text-muted-foreground modern-text">
          Describe your legal case and get a comprehensive AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="description" className="text-base font-medium text-foreground modern-text">
            Describe Your Legal Case
          </Label>
          <Textarea
            id="description"
            placeholder="Please provide complete details about your legal case including case type, situation description, key facts, relevant dates, parties involved, and desired outcome. Be as detailed as possible for the best analysis."
            rows={12}
            value={formData.description}
            onChange={(e) => {
              handleInputChange('description', e.target.value);
              const lines = e.target.value.split('\n');
              if (lines[0] && !formData.title) {
                handleInputChange('title', lines[0].substring(0, 100));
              }
            }}
            className="modern-textarea text-base"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !formData.description.trim()}
          className="w-full modern-button-primary py-4 text-lg"
        >
          {loading ? 'Generating Case Analysis...' : 'Generate Legal Case Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleMode;