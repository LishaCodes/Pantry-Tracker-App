import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './globals.css'; // Ensure this is imported for styling

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="container">
      <Typography variant="h1" sx={{ color: '#ffffff' }}>
        Pantry Tracker
      </Typography>
      <Typography className="login-caption">
        Your go-to app for managing pantry items.
      </Typography>
      <div className="form-container">
        <Typography variant="h4" sx={{ color: 'black' }}>
          {isSignup ? "Sign Up" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            color="secondary"
            InputProps={{
              style: {
                backgroundColor: '#1e1e1e', // Darker gray background for input fields
                color: '#ffffff', // White text color inside inputs
                border: '1px solid #444', // Dark border for contrast
              },
            }}
            InputLabelProps={{ style: { color: '#c1c1c1' } }} // Light gray label color
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            color="secondary"
            InputProps={{
              style: {
                backgroundColor: '#1e1e1e', // Darker gray background for input fields
                color: '#ffffff', // White text color inside inputs
                border: '1px solid #444', // Dark border for contrast
              },
            }}
            InputLabelProps={{ style: { color: '#c1c1c1' } }} // Light gray label color
          />
          {error && <Typography className="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#007bff', // Bright blue background
              color: 'black', // Black text color
              borderRadius: '8px',
              padding: '0.75rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: '#0056b3', // Darker blue on hover
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              },
            }}
            fullWidth
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>
        <Button onClick={() => setIsSignup(!isSignup)} className="signup-button">
          {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
        </Button>
      </div>
    </Container>
  );
}
