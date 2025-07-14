// src/LinkContext.js
import React, { createContext, useState, useEffect } from 'react';

export const LinkContext = createContext(null);

export function LinkProvider({ children }) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('shortLinks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLinks(parsed);
        }
      } catch {
     
      }
    }
  }, []);


  const addLinks = (newLinks) => {
    setLinks(prev => {
      const updated = [...prev, ...newLinks];
      localStorage.setItem('shortLinks', JSON.stringify(updated));  
      return updated;
    });
  };

  const incrementClick = (code) => {
    setLinks(prev => {
      const updated = prev.map(link =>
        link.code.toLowerCase() === code.toLowerCase()
          ? { ...link, clicks: (link.clicks || 0) + 1 }
          : link
      );
      localStorage.setItem('shortLinks', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <LinkContext.Provider value={{ links, addLinks, incrementClick }}>
      {children}
    </LinkContext.Provider>
  );
}
