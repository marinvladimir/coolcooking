import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { apiService, getErrorMessage } from '../api/api';
import { useAuth } from '../states/contexts';
import { Button, Field, Hint, Input, Label } from '../styles/ui';
import { showSuccessNotification } from '../utils/notification';
import AuthLayout, {
  AuthForm,
  FormError,
  Switch,
} from '../components/AuthLayout';
import Spinner from '../components/Spinner';

const MIN_PASSWORD_LENGTH = 6;

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Navigate to="/login" replace />;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { username, email, password } = form;
      await apiService.register({ username: username.trim(), email, password });
      showSuccessNotification('Account created! You can log in now.');
      navigate('/login', { state: { email } });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Grab an apron."
      subtitle="Create a free account to save favorites and share your own recipes."
      quote="Every great cook started with a burnt pancake."
    >
      <AuthForm onSubmit={handleSubmit}>
        {error && <FormError role="alert">{error}</FormError>}
        <Field>
          <Label htmlFor="register-username">Username</Label>
          <Input
            id="register-username"
            name="username"
            autoComplete="username"
            placeholder="How should we call you?"
            minLength={2}
            maxLength={40}
            value={form.username}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
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
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            value={form.password}
            onChange={handleChange}
            aria-describedby="password-hint"
            required
          />
          <Hint id="password-hint">
            At least {MIN_PASSWORD_LENGTH} characters.
          </Hint>
        </Field>
        <Field>
          <Label htmlFor="register-confirm">Confirm password</Label>
          <Input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </Field>
        <Button type="submit" $block $size="lg" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </AuthForm>
      <Switch>
        Already have an account? <Link to="/login">Log in</Link>
      </Switch>
    </AuthLayout>
  );
};

export default Register;
