# QuarryMate

1. **User:**
   - ID (Auto-generated)
   - Username
   - Password
   - Emailid
   - Phone Number
   - Address
   - Role (Customer or Quarry Owner)
   - Registration Date
   - Last Login Date
2. **Quarry:**
   - ID (Auto-generated)
   - Name
   - Description
   - Address
   - Contact Information
   - Opening Hours
   - Ratings
   - Image URL
   - Registration Date
3. **Menu Item:**
   - ID (Auto-generated)
   - Name
   - Description
   - Price
   - Category
   - Image URL
   - Availability Status
   - Quarry (reference to Quarry entity)
   - Creation Date
4. **Order:**
   - ID (Auto-generated)
   - Customer (reference to User entity)
   - Quarry (reference to Quarry entity)
   - Total Amount
   - Order Status
   - Timestamp
   - Delivery Address
   - Items (list of Order Items)
   - Payment (reference to Payment entity, if applicable)
5. **Order Item:**
   - ID (Auto-generated)
   - Menu Item (reference to Menu Item entity)
   - Quantity
   - Subtotal
   - Order (reference to Order entity)
6. **Payment:**
   - ID (Auto-generated)
   - Order (reference to Order entity)
   - Payment Method
   - Payment Status
   - Total Amount
   - Payment Timestamp
7. **~~Delivery Executive:~~**
   - ~~ID (Auto-generated)~~
   - ~~Name~~
   - ~~Contact Information~~
   - ~~Availability Status~~
   - ~~Current Location (Latitude and Longitude)~~
8. **Review/Rating:**
   - ID (Auto-generated)
   - Customer (reference to User entity)
   - Quarry (reference to Quarry entity)
   - Rating
   - Review Text
   - Timestamp
9. **Promotion/Coupon:**
   - ID (Auto-generated)
   - Code
   - Discount Amount
   - Validity Period
   - Terms and Conditions
10. **Notification:**
    - ID (Auto-generated)
    - Recipient (reference to User, Restaurant, or Delivery Executive entity)
    - Message
    - Timestamp
    - Read Status
11. **Category:**
    - ID (Auto-generated)
    - Name
12. **Address:**
    - ID (Auto-generated)
    - Street Address
    - City
    - State/Province
    - Postal Code
    - Country
13. contact information
    - email
    - mobile
    - twitter
    - instagram

**service**

**service-implementation**

**controller**
