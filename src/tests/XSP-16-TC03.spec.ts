const { test, expect } = require('@playwright/test');

// Configure stealth-like settings to avoid detection
test.use({
  viewport: { width: 1920, height: 1080 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  locale: 'en-US',
  timezoneId: 'America/New_York',
  permissions: ['geolocation'],
  geolocation: { latitude: 40.7589, longitude: -73.9851 },
  colorScheme: 'light',
  // Add extra headers to look more like a real browser
  extraHTTPHeaders: {
    'Accept-Language': 'en-US,en;q=0.9',
  }
});

test('test', async ({ page, context }) => {
  // Inject scripts to hide automation indicators before navigation
  await context.addInitScript(() => {
    // Hide webdriver property
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    
    // Mock plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    
    // Mock languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
    
    // Override permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
    
    // Mock chrome runtime
    window.chrome = {
      runtime: {},
    };
    
    // Override toString methods
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    
    // Mock getParameter
    WebGLRenderingContext.prototype.getParameter = new Proxy(
      WebGLRenderingContext.prototype.getParameter,
      {
        apply: (target, thisArg, args) => {
          const param = args[0];
          if (param === 37445) {
            return 'Intel Inc.';
          }
          if (param === 37446) {
            return 'Intel Iris OpenGL Engine';
          }
          return target.apply(thisArg, args);
        },
      }
    );
  });

  await page.goto('https://www.macys.com/?trackingid=407x719090&m_sc=sem&m_sb=Google&m_tp=Trademark&m_ac=Google_Trademark_International&m_ag=Macy%27sCore_Exact&m_cn=GGL_Trademark_INTL_India_Exact&m_pi=go_cmp-94804414_adg-154238310432_ad-674511599963_kwd-252677959_dev-c_ext-_prd-&gad_source=1&gad_campaignid=94804414&gbraid=0AAAAAD-Tw4KV1XAMlOpnR4tW5BpDHDpI3&gclid=Cj0KCQiA9OnJBhD-ARIsAPV51xMkGabS-dVLVVVoM93xZTeN8eHrHfmo07PEmZhr1OrcDz3T2rCAfdwaAt5BEALw_wcB');
  
  // Wait for page to load
  //await page.waitForLoadState('networkidle');
  
  // Handle popups/modals if they appear (with timeout to not fail if they don't)
  try {
    const closeButton = page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible({ timeout: 3000 })) {
      await closeButton.click();
    }
  } catch (e) {
    // Close button not found, continue
  }
  
  try {
    const xButton = page.getByRole('button', { name: '×' });
    if (await xButton.isVisible({ timeout: 3000 })) {
      await xButton.click();
    }
  } catch (e) {
    // X button not found, continue
  }
  
  try {
    const continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    if (await continueShoppingButton.isVisible({ timeout: 3000 })) {
      await continueShoppingButton.click();
    }
  } catch (e) {
    // Continue Shopping button not found, continue
  }
  
  // Click the link
  await page.getByRole('link', { name: 'Handbags & Accessories' }).click();
  await page.waitForTimeout(10000);
});
