import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService, getErrorMessage } from '../api/api';
import { useAuth } from '../states/contexts';
import { Button, Field, Input, Label } from '../styles/ui';
import { showSuccessNotification } from '../utils/notification';
import AuthLayout, {
  AuthForm,
  FormError,
  Switch,
} from '../components/AuthLayout';
import Spinner from '../components/Spinner';

type LocationState = { from?: string; email?: string } | null;

const Login: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [form, setForm] = useState({ email: state?.email ?? '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { token, user } = await apiService.login(form);
      login(token, user);
      showSuccessNotification(`Welcome back, ${user.username}!`);
      navigate(state?.from ?? '/recipes', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return (
      <AuthLayout
        title="You’re logged in"
        subtitle={`Signed in as ${user?.email ?? 'a Cool Cooking member'}.`}
      >
        <AuthForm as="div">
          <Button as={Link} to="/favorites" $block>
            Go to my favorites
          </Button>
          <Button
            type="button"
            $variant="secondary"
            $block
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Log out
          </Button>
        </AuthForm>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to save favorites and share your recipes."
    >
      <AuthForm onSubmit={handleSubmit}>
        {error && <FormError role="alert">{error}</FormError>}
        <Field>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Field>
        <Button type="submit" $block $size="lg" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </AuthForm>
      <Switch>
        New to Cool Cooking? <Link to="/register">Create an account</Link>
      </Switch>
    </AuthLayout>
  );
};

export default Login;
