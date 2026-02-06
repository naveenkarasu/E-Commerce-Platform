import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useAuthStore } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { useToastStore } from '@/hooks/useToast';
import { FloatingProducts3D } from '@/components/three/FloatingProducts3D';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
      setUser({
        username: response.username,
        role: response.role,
        token: response.token,
      });
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch {
      addToast('Registration failed. Username may already exist.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      <FloatingProducts3D />
      <div className="relative z-10 mx-auto max-w-md px-4 py-16 w-full">
        <Card className="border-navy-200 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-white">Create Account</CardTitle>
            <CardDescription className="text-primary-100">Sign up to start shopping</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-navy-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-navy-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <UserPlus className="h-4 w-4" />
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-navy-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
