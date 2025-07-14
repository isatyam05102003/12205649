
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import ShortenerPage from './ShortenerPage';
import StatsPage from './StatsPage';
import RedirectPage from './RedirectPage';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:code" element={<RedirectPage />} />

        <Route path="/404" element={
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">404: Page Not Found</Typography>
            <Typography>
              The requested short URL does not exist or has expired.
            </Typography>
          </Box>
        } />
      </Routes>
    </div>
  );
}

export default App;
