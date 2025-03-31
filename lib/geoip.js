export async function geoIpLookup(ip) {
    if (ip === '127.0.0.1' || ip.startsWith('192.168.')) {
      return { status: 'private', ip };
    }
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      return {
        status: data.status || 'unknown',
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as,
        query: data.query,
      };
    } catch (error) {
      console.error('IP-API lookup failed:', error);
      return { status: 'error', error: error.message };
    }
  }
