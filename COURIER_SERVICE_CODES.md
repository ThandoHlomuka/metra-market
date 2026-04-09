# Courier Service Codes Reference Guide

## Overview
This document provides a comprehensive reference for all courier service codes supported by the Metra Market integration with Bobgo API. Buyers can now choose their preferred courier options with full service code visibility.

---

## Supported Courier Partners

### 1. The Courier Guy (TCG)
**Provider Slug:** `tcg`

The Courier Guy is South Africa's leading private courier company, offering a wide range of delivery services.

#### Service Codes

| Code | Service Name | Description | Delivery Time | Type |
|------|--------------|-------------|---------------|------|
| `01` | Door-to-Door Standard | Standard door-to-door delivery | 1-2 business days (major metros) | Express |
| `DD` | Door-to-Door | Full door-to-door service | 1-2 business days (major metros), 2-4 days (regional) | Express |
| `ECO` | Economy Road | Cost-effective road delivery | 3-5 business days | Economy |
| `ECOR` | Economy Road Return | Economy delivery with return option | 3-5 business days (with return) | Economy |
| `LOX` | Locker-to-Door | Delivery from locker to door | 2-4 business days | Locker |
| `L2L` | Locker-to-Locker | Locker-to-locker delivery | 1-3 business days | Locker |
| `XDD` | Cross-Border Door-to-Door | International cross-border delivery | 3-7 business days | Cross-Border |
| `SAT` | Saturday Delivery | Delivery on Saturday | Next Saturday (requires booking) | Special |
| `HOL` | Holiday/After-Hours Delivery | Delivery on holidays/weekends | Matches selected service level | Special |

#### Recommended Services for E-commerce
- **ECO** - Best for cost-conscious customers (3-5 days)
- **LOX** - Good balance of speed and price (2-4 days)
- **DD/01** - Premium fast delivery (1-2 days)

---

### 2. Pudo
**Provider Slug:** `pudo`

Pudo specializes in locker-to-locker delivery services across South Africa.

#### Service Codes

| Code | Service Name | Description | Delivery Time | Type |
|------|--------------|-------------|---------------|------|
| `L2L` | Locker-to-Locker | Delivery between Pudo lockers | 1-3 business days | Locker |
| `STD` | Standard | Standard locker delivery | 2-5 business days | Standard |

#### Recommended Services for E-commerce
- **L2L** - Fast and affordable locker-to-locker (1-3 days)

---

### 3. Dawn Wing
**Provider Slug:** `dawnwing`

Dawn Wing offers reliable door-to-door and economy delivery services.

#### Service Codes

| Code | Service Name | Description | Delivery Time | Type |
|------|--------------|-------------|---------------|------|
| `01` | Door-to-Door Standard | Standard door delivery | 1-2 business days | Express |
| `DD` | Door-to-Door | Full door delivery | 1-2 business days | Express |
| `ECO` | Economy Road | Economy road delivery | 3-5 business days | Economy |
| `SAT` | Saturday Delivery | Saturday delivery service | Next Saturday | Special |
| `STD` | Standard | Standard delivery | 2-4 business days | Standard |

#### Recommended Services for E-commerce
- **ECO** - Economy option (3-5 days)
- **DD/01** - Express delivery (1-2 days)

---

## API Integration Details

### Shipping Rate Calculation
When calculating shipping rates via `/api/bobgo-shipping`, the API returns all available courier options with:

```json
{
  "code": "tcg",
  "provider_slug": "tcg",
  "service_code": "ECO",
  "service_name": "Economy Road",
  "service_description": "3-5 business days",
  "service_category": "economy",
  "price": 99.00,
  "delivery_time": "3-5 business days"
}
```

### Shipment Creation
When creating a shipment via `/api/bobgo-create-shipment`, the service code is automatically extracted from the selected courier option:

```json
{
  "provider_slug": "tcg",
  "service_code": "ECO",
  "service_type": "ECO",
  "service_level_code": "ECO"
}
```

### Service Code Validation
The API validates service codes against the known valid codes for each provider. Invalid codes will generate a warning but will still be processed to allow flexibility.

---

## Frontend Display

### Checkout Page Features
The checkout page (`checkout.html`) now displays:

1. **Courier Name** - e.g., "The Courier Guy"
2. **Service Code Badge** - e.g., "ECO" (highlighted in red)
3. **Service Name** - e.g., "Economy Road"
4. **Service Description** - e.g., "3-5 business days"
5. **Delivery Time Estimate**
6. **Included Features** - Tracking, Insurance icons
7. **Price** - Service charge in ZAR

Example display:
```
┌─────────────────────────────────────────────┐
│ The Courier Guy (tcg)          Service Charge
│ Economy Road [ECO]                           R99.00
│ ℹ️ 3-5 business days                         │
│ 🕐 3-5 business days 📍 ✅                  │
└─────────────────────────────────────────────┘
```

---

## Service Categories

### Economy Services
Best for cost-conscious customers who can wait longer:
- TCG: `ECO`, `ECOR`
- Dawn Wing: `ECO`
- Pudo: `STD`

### Express Services
Fast delivery for urgent orders:
- TCG: `01`, `DD`
- Dawn Wing: `01`, `DD`

### Locker Services
Convenient locker-to-locker or locker-to-door:
- TCG: `LOX`, `L2L`
- Pudo: `L2L`, `STD`

### Special Services
For specific delivery requirements:
- TCG: `SAT`, `HOL`, `XDD`
- Dawn Wing: `SAT`

---

## Code Examples

### Get Service Code Details (Server-Side)
```javascript
// From bobgo-shipping.js
const serviceDetails = getServiceCodeDetails('tcg', 'ECO');
// Returns: { name: 'Economy Road', description: '3-5 business days', type: 'economy' }
```

### Select Service Code (Client-Side)
```javascript
// From checkout.html
const courierData = selectedShipping.courierData;
const serviceCode = courierData.service_code || 'ECO';
const providerSlug = courierData.provider_slug || 'tcg';
```

### Create Shipment with Service Code
```javascript
const shipmentData = {
  provider_slug: 'tcg',
  service_code: 'ECO',
  service_type: 'ECO',
  service_level_code: 'ECO',
  // ... other fields
};
```

---

## Best Practices for Buyers

### Recommended Service Selection
1. **Local (Gauteng)** - Use `DD` or `01` for 1-2 day delivery
2. **Major Cities** - Use `ECO` for 3-5 day economy delivery
3. **Regional Areas** - Use `ECO` or `LOX` for reliable delivery
4. **Urgent Orders** - Use `DD`/`01` for express service
5. **Weekend Delivery** - Use `SAT` for Saturday delivery
6. **Holiday Periods** - Use `HOL` for after-hours delivery

### Default Service Codes
If no service code is specified, the system defaults to:
- **Provider:** `tcg` (The Courier Guy)
- **Service:** `ECO` (Economy Road)

---

## Troubleshooting

### Common Issues

**Issue:** Service code not showing in checkout
- **Solution:** Check that Bobgo API is returning `service_code` or `service_type` in the response

**Issue:** Invalid service code warning in logs
- **Solution:** Verify the service code exists in the `VALID_SERVICE_CODES` map in `bobgo-create-shipment.js`

**Issue:** Shipment creation fails with service code error
- **Solution:** Check Bobgo API documentation for supported service codes and ensure the provider slug is correct

### Debug Mode
Enable detailed logging by checking the browser console and server logs:
- "Creating shipment with provider: X, service code: Y"
- Service code validation warnings
- Bobgo API response details

---

## API Endpoints

### GET /api/bobgo-shipping
Returns the complete service code map for all couriers:
```json
{
  "success": true,
  "serviceCodes": {
    "tcg": { "01": {...}, "ECO": {...}, ... },
    "pudo": { "L2L": {...}, "STD": {...} },
    "dawnwing": { "01": {...}, "ECO": {...}, ... }
  }
}
```

### POST /api/bobgo-shipping
Returns available courier options with service codes for a specific route.

### POST /api/bobgo-create-shipment
Creates a shipment with the selected service code and provider.

---

## Future Enhancements

1. **Service Code Filtering** - Allow filtering by service type (economy, express, locker)
2. **Delivery Date Estimation** - Calculate exact delivery dates based on service codes
3. **Service Code Recommendations** - AI-based service recommendations based on order value and destination
4. **Real-time Tracking** - Enhanced tracking based on service code type
5. **Cross-Border Support** - Full support for `XDD` cross-border service codes

---

## References

- **Bobgo API Documentation:** https://api-docs.bob.co.za/bobgo
- **Bobgo Helpdesk:** https://help.bobgo.co.za/portal/en/kb/articles/service-level-codes-and-times
- **The Courier Guy:** https://thecourierguy.co.za/
- **Pudo:** https://www.pudo.co.za/
- **Dawn Wing:** https://www.dawnwing.co.za/

---

**Last Updated:** 9 April 2026  
**Version:** 1.0  
**Maintained By:** Metra Market Development Team
