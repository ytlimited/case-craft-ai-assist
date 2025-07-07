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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Case Title *</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title for your case"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseType">Case Type *</Label>
            <Select onValueChange={(value) => handleInputChange('caseType', value)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {caseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Case Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description of your legal case..."
            rows={6}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            placeholder="Any additional information that might be relevant..."
            rows={4}
            value={formData.additionalDetails}
            onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
            className="rounded-xl"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !formData.title || !formData.description || !formData.caseType}
          className="w-full glass-button-primary rounded-xl py-3"
        >
          {loading ? 'Generating Case Analysis...' : 'Generate Legal Case'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleMode;