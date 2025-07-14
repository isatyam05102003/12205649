
import React, { useContext } from 'react';
import { LinkContext } from './LinkContext';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function StatsPage() {
  const { links } = useContext(LinkContext);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Shortened URL Statistics</Typography>

      {links.length === 0 ? (
        <Typography>No URLs have been shortened yet.</Typography>
      ) : (
        <Table aria-label="URL Statistics">
          <TableHead>
            <TableRow>
              <TableCell><strong>Shortcode</strong></TableCell>
              <TableCell><strong>Original URL</strong></TableCell>
              <TableCell><strong>Clicks</strong></TableCell>
              <TableCell><strong>Expires At</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link, idx) => {
              const expired = Date.now() > link.expiresAt;
              return (
                <TableRow key={idx}>
                  <TableCell>{link.code}</TableCell>
                  <TableCell>
                    <a href={link.original} target="_blank" rel="noopener noreferrer">
                      {link.original}
                    </a>
                  </TableCell>
                  <TableCell>{link.clicks || 0}</TableCell>
                  <TableCell>
                    {expired ? 'Expired' : new Date(link.expiresAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default StatsPage;
