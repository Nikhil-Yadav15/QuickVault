export async function getISP(ip) {
    if (ip === '127.0.0.1') return 'Localhost';
    
    try {
      const response = await fetch(`https://ipwhois.app/json/${ip}`);
      const data = await response.json();
      return data.isp || data.org || 'Unknown';
    } catch (error) {
      console.error('ISP lookup failed:', error);
      return 'Unknown';
    }
  }
