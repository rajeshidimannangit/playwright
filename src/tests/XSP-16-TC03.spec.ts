import { test, expect } from '@playwright/test';

// Page Object Model for the Product Page
class ProductPage {
  readonly page;
  readonly searchBarSelector = 'input[type="search"]'; // Selector for the search bar

  constructor(page) {
    this.page = page;
  }

  // Navigate to the product page
  async navigateTo() {
    await this.page.goto('https://example.com/product'); // Replace with the actual product page URL
  }

  // Check if the search bar is visible
  async isSearchBarVisible(): Promise<boolean> {
    return this.page.isVisible(this.searchBarSelector);
  }

  // Check if the search bar is accessible (e.g., focusable)
  async isSearchBarAccessible(): Promise<boolean> {
    const searchBar = await this.page.$(this.searchBarSelector);
    if (!searchBar) return false;
    return searchBar.isEnabled();
  }
}

// Test suite for verifying the search bar on the product page
test.describe('XSP-15: Verify the search bar on the product page', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    // Initialize the ProductPage object
    productPage = new ProductPage(page);

    // Navigate to the product page (precondition)
    await productPage.navigateTo();
  });

  test('Search bar is visible and accessible', async () => {
    // Verify the search bar is visible
    const isVisible = await productPage.isSearchBarVisible();
    expect(isVisible).toBeTruthy(); // Assert that the search bar is visible

    // Verify the search bar is accessible
    const isAccessible = await productPage.isSearchBarAccessible();
    expect(isAccessible).toBeTruthy(); // Assert that the search bar is accessible
  });
});
