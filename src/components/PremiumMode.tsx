import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, Edit, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumModeProps {
  formData: {
    title: string;
    description: string;
    caseType: string;
    additionalDetails: string;
  };
  setFormData: (data: any) => void;
  onGenerate: () => void;
  loading: boolean;
  conversationHistory: Array<{role: string, content: string}>;
  setConversationHistory: (history: any) => void;
  currentConversation: string;
  setCurrentConversation: (msg: string) => void;
  caseTypes: string[];
  generatedResult: string;
  setGeneratedResult: (result: string) => void;
}

const PremiumMode: React.FC<PremiumModeProps> = ({
  formData,
  setFormData,
  onGenerate,
  loading,
  conversationHistory,
  setConversationHistory,
  currentConversation,
  setCurrentConversation,
  caseTypes,
  generatedResult,
  setGeneratedResult
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState(generatedResult);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const startConversation = () => {
    if (!formData.title || !formData.description || !formData.caseType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in title, description, and case type first',
        variant: 'destructive',
      });
      return;
    }
    onGenerate();
  };

  const sendMessage = () => {
    if (!currentConversation.trim()) return;

    setConversationHistory([...conversationHistory, {
      role: 'user',
      content: currentConversation
    }]);
    setCurrentConversation('');
    onGenerate();
  };

  const saveEdits = () => {
    setGeneratedResult(editableResult);
    setIsEditing(false);
    toast({
      title: 'Saved!',
      description: 'Your changes have been saved',
    });
  };

  const addNewSection = () => {
    const newSection = '\n\n## New Section\nAdd your content here...';
    setEditableResult(prev => prev + newSection);
  };

  return (
    <div className="space-y-6">
      {conversationHistory.length === 0 ? (
        <Card className="glass-card border-0 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Premium Interactive Mode
            </CardTitle>
            <CardDescription>
              Start with basic case details, then let our AI ask follow-up questions for a personalized analysis
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
                placeholder="Provide a brief overview of your legal case..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button
              onClick={startConversation}
              disabled={loading || !formData.title || !formData.description || !formData.caseType}
              className="w-full glass-button-primary rounded-xl py-3"
            >
              {loading ? 'Starting AI Consultation...' : 'Start AI Consultation'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Panel */}
          <Card className="glass-card border-0 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI Consultation
              </CardTitle>
              <CardDescription>
                Interactive conversation with your legal AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {conversationHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {msg.role === 'user' ? (
                          <User className="h-4 w-4 mr-1" />
                        ) : (
                          <Bot className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-xs font-medium">
                          {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your response or ask a question..."
                  value={currentConversation}
                  onChange={(e) => setCurrentConversation(e.target.value)}
                  className="rounded-xl flex-1"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !currentConversation.trim()}
                  className="glass-button-primary rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result Panel */}
          {generatedResult && (
            <Card className="glass-card border-0 rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Case Analysis
                    </CardTitle>
                    <CardDescription>
                      Editable legal case analysis
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={saveEdits}
                          className="glass-button-primary rounded-xl"
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={addNewSection}
                          className="glass-button rounded-xl"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setEditableResult(generatedResult);
                        }}
                        className="glass-button rounded-xl"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editableResult}
                    onChange={(e) => setEditableResult(e.target.value)}
                    className="min-h-96 font-mono text-sm rounded-xl"
                  />
                ) : (
                  <div className="bg-background/50 rounded-xl p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-mono">
                      {generatedResult}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumMode;