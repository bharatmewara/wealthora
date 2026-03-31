import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { state, login } = useAuth();

  // Redirect if already authenticated
  if (state.isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await login(email, password);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2
          }}
        >
          <Box
            sx={{
              bgcolor: '#f97316',
              borderRadius: '50%',
              p: 1.5,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock sx={{ fontSize: 32, color: 'white' }} />
          </Box>

          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
            Admin Login
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3, textAlign: 'center' }}>
            Sign in to access the admin dashboard
          </Typography>

          {errors.submit && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              error={!!errors.email}
              helperText={errors.email}
              disabled={state.loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
              disabled={state.loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={state.loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#f97316',
                color: 'white',
                fontWeight: 600,
                py: 1.2,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#ea580c'
                },
                '&:disabled': {
                  bgcolor: '#cbd5e1',
                  color: '#64748b'
                }
              }}
              disabled={state.loading}
            >
              {state.loading ? (
                <CircularProgress size={24} sx={{ color: 'inherit' }} />
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: '#64748b', mt: 2 }}>
              Demo credentials: admin@wealthora.com / password123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
