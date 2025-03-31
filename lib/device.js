import {UAParser} from 'ua-parser-js';

export function deviceDetector(userAgent) {
  const parser = new UAParser(userAgent);
  const ua = parser.getResult();
  
  return {
    deviceType: ua.device.type || 'desktop',
    deviceVendor: ua.device.vendor,
    deviceModel: ua.device.model,
    browser: ua.browser.name,
    browserVersion: ua.browser.version,
    os: ua.os.name,
    osVersion: ua.os.version,
    engine: ua.engine.name,
    cpu: ua.cpu.architecture,
  };
}
