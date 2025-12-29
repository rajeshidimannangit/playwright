const { test, expect } = require('@playwright/test');

const element_visibility_timeout_duration=3000
const macys_url='https://www.macys.com/?trackingid=407x719090&m_sc=sem&m_sb=Google&m_tp=Trademark&m_ac=Google_Trademark_International&m_ag=Macy%27sCore_Exact&m_cn=GGL_Trademark_INTL_India_Exact&m_pi=go_cmp-94804414_adg-154238310432_ad-674511599963_kwd-252677959_dev-c_ext-_prd-&gad_source=1&gad_campaignid=94804414&gbraid=0AAAAAD-Tw4KV1XAMlOpnR4tW5BpDHDpI3&gclid=Cj0KCQiA9OnJBhD-ARIsAPV51xMkGabS-dVLVVVoM93xZTeN8eHrHfmo07PEmZhr1OrcDz3T2rCAfdwaAt5BEALw_wcB'

const closeBtn_role='button'
const closeBtn_name='Close'

const xBtn_role='button'
const xBtn_name='Close'

const continue_shopping_role='button'
const continue_shopping_name='Continue Shopping'

const search_input_role='textbox'
const search_input_name='search input'

const product_category_to_search='fossil brown leather watches'
//const product_category_to_search='Handbags'

const product_name_to_search="Men\'s Chronograph Grant Brown Leather Strap Watch 44mm"
//const product_name_to_search="Faux-Leather Reversible Tote Bag"

const close_search_role='button'
const close_search_name='Close search'

const add_to_bag_role='button'
const add_to_bag_name='Add To Bag'

const select_store_btn='//span[normalize-space(.)=\'Your store\']/ancestor::button'

const store_field='//input[@placeholder="Search by address or zip"]'

const store_city='Chicago'

const set_store_role='button'
const set_store_name='Set Macy\'s State Street As My Store'

const pickup_option='(//input[@value="Pickup"])[1]'

// Configure stealth-like settings to avoid detection
test.use({
  //viewport: { width: 1920, height: 1080 },
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

test('Update Delivery Option', async ({ page, context }) => {
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

  await page.goto(macys_url);
  
  // Wait for page to load
  //await page.waitForLoadState('networkidle');
  
  // Handle popups/modals if they appear (with timeout to not fail if they don't)
  try {
    const closeButton = page.getByRole(closeBtn_role, { name: closeBtn_name });
    if (await closeButton.isVisible({ timeout: element_visibility_timeout_duration })) {
      await closeButton.click();
	  console.log('Close Button Clicked')
    }
  } catch (e) {
   console.log('Close Button Not Found')
  }
  
  try {
    const xButton = page.getByRole(xBtn_role, { name: xBtn_name });
    if (await xButton.isVisible({ timeout: element_visibility_timeout_duration })) {
      await xButton.click();
	  console.log('X Button Clicked')
    }
  } catch (e) {
    console.log('X Button Not Found')
  }
  
  try {
    const continueShoppingButton = page.getByRole(continue_shopping_role, { name: continue_shopping_name });
    if (await continueShoppingButton.isVisible({ timeout: element_visibility_timeout_duration })) {
      await continueShoppingButton.click();
	  console.log('Continue Shopping Button Clicked')
    }
  } catch (e) {
    // Continue Shopping button not found, continue
  }
  
  const search_input_box=await page.getByRole(search_input_role, { name: search_input_name})

  search_input_box.click();
  search_input_box.fill(product_category_to_search);
  search_input_box.press('Enter');
 
  console.log("Product Searched - "+product_category_to_search)
  
  try {
     const close_search_btn=await page.getByRole(close_search_role, { name: close_search_name }).click()
    if (await close_search_btn.isVisible({ timeout: element_visibility_timeout_duration })) {
      await close_search_btn.click();
	  console.log("Close Search Button Clicked")
    }
  } catch (e) {
    console.log('Close Search Button Not Found')
  }
 
  
  const pagePromise = context.waitForEvent('page');
  

  //selecting first occurrence of the product
  
  const product_name_xpath='(//a[@title="'+product_name_to_search+'"])[1]'
  console.log('Product Name XPath'+product_name_xpath)
  await page.locator(product_name_xpath).click();
  
  //await page.locator('(//a[@title="Men\'s Chronograph Grant Brown Leather Strap Watch 44mm"])[1]').click();
  
  console.log("Product Selected - "+product_name_to_search)
  
  page = await pagePromise;
  
  console.log('New Tab Title - '+await page.title());
  
  await page.getByRole(add_to_bag_role, { name: add_to_bag_name }).click();
   
  console.log("Product Added to Bag")
  
  
  //await page.getByRole('link', { name: 'View Bag' }).click();
  //console.log("view bag clicked!!!!")
  await page.locator(select_store_btn).click();
  await page.locator(store_field).click();
  await page.locator(store_field).fill(store_city);
  await page.locator(store_field).press('Enter');
  
  console.log("Store Selected")
  
  await page.getByRole(set_store_role, { name: set_store_name }).click();
  
  await page.locator(pickup_option).check();
  
  console.log("Delivery Option Selected as Pickup");
  
  expect(page.locator(pickup_option)).toBeChecked();
  
  console.log('Delivery Option Assertion Completed');
  
  //await page.locator('//*[@id="orderSummary"]/div[3]/div[2]/div/button').click();
  //await page.locator('//a[@title="Shopping bag"]').click();
  
  
  
});
