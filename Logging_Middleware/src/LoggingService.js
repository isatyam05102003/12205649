// src/loggingService.js
export async function log(level, pkg, message) {
  const logEntry = {
    stack: 'frontend',      
    level: level,           
    package: pkg,           
    message: message        
  };
  try {
    await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    });
 
  } catch (error) {
 
  }
}
