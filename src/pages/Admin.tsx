import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    checkAdminStatus();
    fetchAdminUsers();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(!!data);
      setLoading(false);

      if (!data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const addAdminUser = async () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .insert([{ email: email.trim() }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Admin user added successfully',
      });
      
      setEmail('');
      fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add admin user',
        variant: 'destructive',
      });
    }
  };

  const removeAdminUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Admin user removed successfully',
      });
      
      fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove admin user',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="modern-background min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="modern-background min-h-screen flex items-center justify-center">
        <Card className="modern-card max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You do not have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="modern-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8 modern-heading">Admin Panel</h1>
        
        <div className="grid gap-8">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="modern-subheading">Add New Admin User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="modern-input"
                />
              </div>
              <Button onClick={addAdminUser} className="modern-button-primary">
                Add Admin User
              </Button>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="modern-subheading">Current Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeAdminUser(admin.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {adminUsers.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No admin users found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;