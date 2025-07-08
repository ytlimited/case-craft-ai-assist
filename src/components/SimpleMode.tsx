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
      <Card className="clean-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-medium text-gray-800">
                Generated Case Analysis
              </CardTitle>
              <CardDescription className="text-gray-600">Your legal case analysis is ready</CardDescription>
            </div>
            <Button
              onClick={copyToClipboard}
              className="clean-button"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {result}
            </pre>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => window.location.reload()}
              className="clean-button-primary"
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
    <Card className="clean-card">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">
          Simple Mode
        </CardTitle>
        <CardDescription className="text-gray-600">
          Describe your legal case and get a complete analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
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
            className="clean-textarea text-sm"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !formData.description.trim()}
          className="w-full clean-button-primary py-3"
        >
          {loading ? 'Generating Case Analysis...' : 'Generate Legal Case Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleMode;