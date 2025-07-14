
import React, { useState, useContext } from 'react';
import { LinkContext } from './LinkContext';
import { log } from './LoggingService';
import { TextField, Button, IconButton, Grid, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ShortenerPage() {
  const { links, addLinks } = useContext(LinkContext);
 
  const [urlInputs, setUrlInputs] = useState([
    { original: '', customCode: '', validity: '', errors: {} }
  ]);
  
  const [resultLinks, setResultLinks] = useState([]);


  const addInputRow = () => {
    log('info', 'component', 'Add URL input row clicked');
    setUrlInputs(prev => [
      ...prev,
      { original: '', customCode: '', validity: '', errors: {} }
    ]);
  };
  const removeInputRow = (index) => {
    log('info', 'component', 'Remove URL input row clicked');
    setUrlInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    setUrlInputs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const generateUniqueCode = (existingSet) => {
    const length = 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (existingSet.has(code.toLowerCase()));
    return code;
  };

  const handleShorten = () => {
    log('info', 'page', 'Shorten URLs button clicked');
    const newLinks = [];
    let hasError = false;

    setUrlInputs(prev => prev.map(item => ({ ...item, errors: {} })));

   
    const seenCodes = {};  
    urlInputs.forEach((item, idx) => {
      const code = item.customCode.trim();
      if (code) {
        const codeLower = code.toLowerCase();
        if (!seenCodes[codeLower]) {
          seenCodes[codeLower] = [idx];
        } else {
          
          seenCodes[codeLower].push(idx);
        }
      }
    });
    
    for (const codeLower in seenCodes) {
      if (seenCodes[codeLower].length > 1) {
        seenCodes[codeLower].forEach(index => {
          
          setUrlInputs(prev => {
            const updated = [...prev];
            updated[index].errors = {
              ...updated[index].errors,
              customCode: 'Shortcode must be unique'
            };
            return updated;
          });
          log('warn', 'component', `Duplicate shortcode "${codeLower}" in inputs`);
        });
        hasError = true;
      }
    }

    
    urlInputs.forEach((item, index) => {
      const errors = {};
      const originalTrimmed = item.original.trim();
      const customCodeTrimmed = item.customCode.trim();
      const validityTrimmed = item.validity.trim();
      
      if (!originalTrimmed) {
        errors.original = 'URL is required';
      } else {
        try {
          new URL(originalTrimmed);  
          if (!/^https?:\/\//i.test(originalTrimmed)) {
            errors.original = 'URL must start with http:// or https://';
          }
        } catch {
          errors.original = 'Invalid URL format';
        }
      }
      let minutes = 30;  
      if (validityTrimmed) {
        const min = parseInt(validityTrimmed, 10);
        if (isNaN(min) || min <= 0) {
          errors.validity = 'Must be a positive number';
        } else {
          minutes = min;
        }
      }
      let shortCode = customCodeTrimmed;
      if (customCodeTrimmed) {
        if (!/^[A-Za-z0-9]+$/.test(customCodeTrimmed)) {
          errors.customCode = 'Only letters and numbers allowed';
        }
       
      }

      if (Object.keys(errors).length > 0) {
        hasError = true;
        
        setUrlInputs(prev => {
          const updated = [...prev];
          updated[index].errors = { ...updated[index].errors, ...errors };
          return updated;
        });
      } else {
        newLinks.push({
          original: originalTrimmed,
          code: shortCode || '',      
          createdAt: Date.now(),
          expiresAt: Date.now() + minutes * 60 * 1000,  
          clicks: 0
        });
      }
    });

    if (hasError) {
      log('warn', 'page', 'Validation failed for one or more URL inputs');
      return;  
    }
    const existingCodes = new Set(links.map(link => link.code.toLowerCase()));
   
    newLinks.forEach(link => {
      if (link.code) {
        if (existingCodes.has(link.code.toLowerCase())) {
          
          const errorMsg = `Shortcode "${link.code}" already exists`;
          log('warn', 'page', errorMsg);
          
          const conflictIndex = urlInputs.findIndex(item => item.customCode.trim().toLowerCase() === link.code.toLowerCase());
          if (conflictIndex !== -1) {
            setUrlInputs(prev => {
              const updated = [...prev];
              updated[conflictIndex].errors = {
                ...updated[conflictIndex].errors,
                customCode: 'Shortcode already in use'
              };
              return updated;
            });
          }
          hasError = true;
        } else {
          existingCodes.add(link.code.toLowerCase());
        }
      }
    });
    if (hasError) {
      return;
    }

    newLinks.forEach(link => {
      if (!link.code || link.code === '') {
        link.code = generateUniqueCode(existingCodes);
        existingCodes.add(link.code.toLowerCase());
      }
    });

    addLinks(newLinks);
    newLinks.forEach(link => {
      log('info', 'state', `Short link created: ${link.code} -> ${link.original}`);
    });

    setResultLinks(newLinks);  
    setUrlInputs([{ original: '', customCode: '', validity: '', errors: {} }]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>

    
      {urlInputs.map((item, idx) => (
        <Grid container spacing={2} alignItems="flex-start" key={idx} sx={{ mb: 1 }}>
        
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Original URL"
              placeholder="https://example.com"
              value={item.original}
              onChange={(e) => handleInputChange(idx, 'original', e.target.value)}
              error={!!item.errors.original}
              helperText={item.errors.original || ' '}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              placeholder="e.g. 30"
              value={item.validity}
              onChange={(e) => handleInputChange(idx, 'validity', e.target.value)}
              error={!!item.errors.validity}
              helperText={item.errors.validity || ' '}
            />
          </Grid>
   
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              placeholder="Optional"
              value={item.customCode}
              onChange={(e) => handleInputChange(idx, 'customCode', e.target.value)}
              error={!!item.errors.customCode}
              helperText={item.errors.customCode || ' '}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            {urlInputs.length > 1 && (
              <IconButton color="error" onClick={() => removeInputRow(idx)} aria-label="remove">
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
      {urlInputs.length < 5 && (
        <Button variant="text" onClick={addInputRow}>
          + Add another URL
        </Button>
      )}

      <Box mt={2}>
        <Button variant="contained" onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>
      {resultLinks.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {resultLinks.map((link, index) => (
            <Box key={index} sx={{ my: 1 }}>
              <Typography><strong>Original:</strong> {link.original}</Typography>
              <Typography>
                <strong>Short URL:</strong>{' '}
                <a href={`${window.location.origin}/${link.code}`} target="_blank" rel="noopener noreferrer">
                  {window.location.origin}/{link.code}
                </a>
              </Typography>
              <Typography>
                <strong>Expires:</strong>{' '}
                {new Date(link.expiresAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ShortenerPage;
