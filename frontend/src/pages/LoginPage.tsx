import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useAuthStore } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { useToastStore } from '@/hooks/useToast';
import { FloatingProducts3D } from '@/components/three/FloatingProducts3D';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({
        username: formData.username,
        password: formData.password,
      });
      setUser({
        username: response.username,
        role: response.role,
        token: response.token,
      });
      addToast('Logged in successfully!', 'success');
      navigate('/');
    } catch {
      addToast('Invalid username or password.', 'error');
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
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-primary-100">Sign in to your account to continue</CardDescription>
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <LogIn className="h-4 w-4" />
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-navy-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600">
                Sign up
              </Link>
            </div>

            <div className="mt-4 rounded-md bg-primary-50 border border-primary-200 p-3 text-xs text-navy-600">
              <p className="font-medium mb-1 text-primary-700">Demo Credentials:</p>
              <p>User: user1 / password123</p>
              <p>Admin: admin / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
