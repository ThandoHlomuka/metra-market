/**
 * Address Locator / Autocomplete Feature
 * Provides real-time address suggestions as you type
 * Uses Nominatim OpenStreetMap API (free, no API key required)
 * Optimized for South African addresses
 */

class AddressLocator {
    constructor(options = {}) {
        this.searchDelay = 300; // ms delay before searching
        this.minChars = 3; // minimum characters before searching
        this.maxResults = 5; // max suggestions to show
        this.countryCode = 'za'; // South Africa
        this.apiEndpoint = 'https://nominatim.openstreetmap.org/search';
        this.searchTimeout = null;
        this.suggestions = [];
        this.selectedIndex = -1;
        
        // Callbacks
        this.onAddressSelect = options.onAddressSelect || null;
        
        // Container references
        this.inputElement = null;
        this.dropdownElement = null;
        this.formFields = options.formFields || {};
    }

    /**
     * Initialize address locator on an input element
     * @param {HTMLElement} inputElement - The input field to attach to
     * @param {Object} formFields - Object mapping field names to input IDs
     * Example: { street: 'address', city: 'city', postalCode: 'postal', province: 'province' }
     */
    attach(inputElement, formFields = {}) {
        this.inputElement = inputElement;
        this.formFields = formFields;
        
        // Create dropdown container
        this.createDropdown();
        
        // Attach event listeners
        this.attachEvents();
    }

    /**
     * Create the dropdown suggestion container
     */
    createDropdown() {
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'address-locator-dropdown';
        this.dropdownElement.style.display = 'none';
        
        // Insert after the input element
        this.inputElement.parentNode.insertBefore(
            this.dropdownElement,
            this.inputElement.nextSibling
        );
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.dropdownElement.contains(e.target) && e.target !== this.inputElement) {
                this.hideDropdown();
            }
        });
    }

    /**
     * Attach event listeners to the input
     */
    attachEvents() {
        // Input event with debounce
        this.inputElement.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= this.minChars) {
                this.searchTimeout = setTimeout(() => {
                    this.searchAddress(query);
                }, this.searchDelay);
            } else {
                this.hideDropdown();
            }
        });

        // Keyboard navigation
        this.inputElement.addEventListener('keydown', (e) => {
            if (!this.dropdownElement || this.dropdownElement.style.display === 'none') {
                return;
            }

            const items = this.dropdownElement.querySelectorAll('.address-suggestion');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                    this.highlightSuggestion(items);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this.highlightSuggestion(items);
                    break;
                    
                case 'Enter':
                    if (this.selectedIndex >= 0) {
                        e.preventDefault();
                        const selected = items[this.selectedIndex];
                        if (selected) {
                            this.selectAddress(selected.dataset.index);
                        }
                    }
                    break;
                    
                case 'Escape':
                    this.hideDropdown();
                    break;
            }
        });

        // Focus event - show dropdown if there are suggestions
        this.inputElement.addEventListener('focus', () => {
            if (this.suggestions.length > 0 && this.inputElement.value.length >= this.minChars) {
                this.showDropdown();
            }
        });
    }

    /**
     * Highlight the currently selected suggestion
     */
    highlightSuggestion(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Search for addresses using Nominatim API
     */
    async searchAddress(query) {
        try {
            // Show loading state
            this.showLoading();

            const params = new URLSearchParams({
                q: query,
                countrycodes: this.countryCode,
                format: 'json',
                limit: this.maxResults,
                addressdetails: 1,
                'accept-language': 'en'
            });

            const response = await fetch(`${this.apiEndpoint}?${params.toString()}`, {
                headers: {
                    'User-Agent': 'MetraMarket/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            this.suggestions = data;
            
            if (data.length > 0) {
                this.renderSuggestions(data);
                this.showDropdown();
            } else {
                this.hideDropdown();
            }
        } catch (error) {
            console.error('Address search error:', error);
            this.hideDropdown();
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.dropdownElement.innerHTML = `
            <div class="address-suggestion loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Searching addresses...</span>
            </div>
        `;
    }

    /**
     * Render address suggestions
     */
    renderSuggestions(addresses) {
        this.dropdownElement.innerHTML = addresses.map((addr, index) => {
            const displayAddress = this.formatAddress(addr);
            const icon = this.getAddressIcon(addr);
            
            return `
                <div class="address-suggestion" 
                     data-index="${index}" 
                     onclick="addressLocatorInstance.selectAddress(${index})">
                    <i class="${icon}"></i>
                    <div class="address-text">${displayAddress}</div>
                </div>
            `;
        }).join('');
        
        this.selectedIndex = -1;
    }

    /**
     * Format address for display
     */
    formatAddress(addr) {
        const parts = [];
        
        if (addr.address) {
            const a = addr.address;
            
            // Build address from components
            if (a.house_number && a.road) {
                parts.push(`${a.house_number} ${a.road}`);
            } else if (a.road) {
                parts.push(a.road);
            }
            
            if (a.suburb) {
                parts.push(a.suburb);
            }
            
            if (a.city || a.town) {
                parts.push(a.city || a.town);
            }
            
            if (a.state) {
                parts.push(a.state);
            }
            
            if (a.postcode) {
                parts.push(a.postcode);
            }
        }
        
        // Fallback to display_name if we couldn't parse
        if (parts.length === 0) {
            return addr.display_name.split(',').slice(0, 3).join(', ');
        }
        
        return parts.join(', ');
    }

    /**
     * Get appropriate icon for address type
     */
    getAddressIcon(addr) {
        const type = addr.type || '';
        
        if (['house', 'building'].includes(type)) {
            return 'fas fa-home';
        } else if (['residential', 'neighbourhood'].includes(type)) {
            return 'fas fa-map-marker-alt';
        } else if (type === 'road') {
            return 'fas fa-road';
        } else if (type === 'suburb') {
            return 'fas fa-map-pin';
        }
        
        return 'fas fa-map-marker-alt';
    }

    /**
     * Show the dropdown
     */
    showDropdown() {
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'block';
        }
    }

    /**
     * Hide the dropdown
     */
    hideDropdown() {
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'none';
        }
        this.selectedIndex = -1;
    }

    /**
     * Select an address from suggestions
     */
    selectAddress(index) {
        const address = this.suggestions[index];
        if (!address || !address.address) return;

        const addr = address.address;
        
        // Update input field with selected address
        this.inputElement.value = this.formatAddress(address);
        
        // Auto-fill form fields if configured
        this.autoFillFields(addr);
        
        // Hide dropdown
        this.hideDropdown();
        
        // Trigger callback if provided
        if (this.onAddressSelect && typeof this.onAddressSelect === 'function') {
            this.onAddressSelect(address);
        }
    }

    /**
     * Auto-fill form fields based on selected address
     */
    autoFillFields(addr) {
        // Street address
        if (this.formFields.street) {
            const streetInput = document.getElementById(this.formFields.street);
            let street = '';
            if (addr.house_number && addr.road) {
                street = `${addr.house_number} ${addr.road}`;
            } else if (addr.road) {
                street = addr.road;
            }
            if (street && streetInput) {
                streetInput.value = street;
            }
        }

        // City
        if (this.formFields.city) {
            const cityInput = document.getElementById(this.formFields.city);
            const city = addr.city || addr.town || addr.village || addr.suburb || '';
            if (city && cityInput) {
                cityInput.value = city;
            }
        }

        // Postal code
        if (this.formFields.postalCode) {
            const postalInput = document.getElementById(this.formFields.postalCode);
            if (addr.postcode && postalInput) {
                postalInput.value = addr.postcode;
            }
        }

        // Province/State
        if (this.formFields.province) {
            const provinceInput = document.getElementById(this.formFields.province);
            const province = addr.state || '';
            if (province && provinceInput) {
                provinceInput.value = province;
                
                // Trigger change event for select elements
                const event = new Event('change', { bubbles: true });
                provinceInput.dispatchEvent(event);
            }
        }
    }
}

// Global instance for inline onclick handlers
let addressLocatorInstance = null;

/**
 * Initialize the address locator on the checkout form
 * This function can be called after the form is rendered
 */
function initCheckoutAddressLocator() {
    const addressInput = document.getElementById('checkoutAddress');
    if (addressInput && !addressLocatorInstance) {
        addressLocatorInstance = new AddressLocator({
            formFields: {
                street: 'checkoutAddress',
                city: 'checkoutCity',
                postalCode: 'checkoutPostalCode',
                province: 'checkoutProvince'
            },
            onAddressSelect: (addressData) => {
                console.log('Address selected:', addressData);
            }
        });
        
        addressLocatorInstance.attach(addressInput, {
            street: 'checkoutAddress',
            city: 'checkoutCity',
            postalCode: 'checkoutPostalCode',
            province: 'checkoutProvince'
        });
        
        console.log('Address locator initialized on checkout form');
    }
}

// Initialize on DOMContentLoaded for static forms
document.addEventListener('DOMContentLoaded', () => {
    // Check if checkout form already exists (static HTML)
    const addressInput = document.getElementById('checkoutAddress');
    if (addressInput) {
        initCheckoutAddressLocator();
    }
});
