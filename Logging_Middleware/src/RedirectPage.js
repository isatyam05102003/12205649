
import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LinkContext } from './LinkContext';
import { log } from './LoggingService';

function RedirectPage() {
  const { code } = useParams();     
  const navigate = useNavigate();
  const { links, incrementClick } = useContext(LinkContext);

  useEffect(() => {
    
    const link = links.find(l => l.code.toLowerCase() === code.toLowerCase());
    if (!link) {
      
      log('warn', 'page', `Shortcode "${code}" not found`);
      navigate('/404', { replace: true });  
    } else if (Date.now() > link.expiresAt) {
    
      log('warn', 'page', `Shortcode "${code}" has expired`);
      navigate('/404', { replace: true }); 
    } else {
     
      log('info', 'page', `Redirecting shortcode "${code}" to original URL`);
      incrementClick(code);                
      window.location.href = link.original; 
    }
  }, [code, links, navigate, incrementClick]);

  return null; 
}

export default RedirectPage;
