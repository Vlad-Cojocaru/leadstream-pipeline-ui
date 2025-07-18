# Make.com Webhook Debugging Guide

## Issue: Variables Not Being Received in Make.com

If you're not seeing `clientSlug` or other variables in your Make.com scenario, here's how to debug and fix it:

## 🔍 **Step 1: Test with Simple Payload**

1. **Go to your webhook test page** (`/webhook-test`)
2. **Click "Test Simple (Debug)"** button
3. **Check the console** for the exact payload being sent

You should see something like:
```json
{
  "clientSlug": "test-client",
  "test": true,
  "message": "Testing webhook data reception"
}
```

## 🔧 **Step 2: Make.com Webhook Configuration**

### A. Check Your Webhook Module Settings

1. **In your Make.com scenario**, click on the **Webhook module**
2. **Verify these settings**:
   - **Method**: POST
   - **Content Type**: JSON
   - **Data Structure**: Should be set to "JSON" or "Auto-detect"

### B. Data Structure Configuration

1. **Click "Add" next to "Data Structure"**
2. **Choose "JSON"** as the data type
3. **Paste this sample structure**:
```json
{
  "clientSlug": "string",
  "action": "string",
  "timestamp": "string",
  "test": "boolean",
  "message": "string"
}
```

### C. Alternative: Use Auto-detect

1. **Set Data Structure to "Auto-detect"**
2. **Send a test webhook** from your app
3. **Make.com will automatically detect** the structure

## 🧪 **Step 3: Test Different Payload Formats**

### Test 1: Simple JSON
```json
{
  "clientSlug": "test-client",
  "test": true
}
```

### Test 2: Form Data (Alternative)
If JSON isn't working, try form data:
```javascript
// In browser console
fetch('https://hook.us2.make.com/htmv8xfnozjbvwyuej4tv7d3up9k47ne', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'clientSlug=test-client&test=true&message=Testing'
}).then(r => r.text()).then(console.log);
```

## 🔍 **Step 4: Check Make.com Logs**

1. **Go to your Make.com scenario**
2. **Click on the webhook module**
3. **Look for "Operations" tab**
4. **Check recent executions** for:
   - **Incoming data**
   - **Error messages**
   - **Response codes**

## 🛠️ **Step 5: Common Issues & Solutions**

### Issue 1: "No data received"
**Solution**: 
- Check webhook URL is correct
- Verify scenario is active
- Test with Postman or curl first

### Issue 2: "Data structure mismatch"
**Solution**:
- Set Data Structure to "Auto-detect"
- Or manually define the structure
- Remove any existing structure and recreate

### Issue 3: "Variables not mapping"
**Solution**:
- In your scenario, click on the webhook module
- Look for "Data" section
- Map variables manually if auto-mapping failed

## 🧪 **Step 6: Manual Testing**

### Using cURL:
```bash
curl -X POST https://hook.us2.make.com/htmv8xfnozjbvwyuej4tv7d3up9k47ne \
  -H "Content-Type: application/json" \
  -d '{"clientSlug":"test-client","test":true,"message":"Testing"}'
```

### Using Postman:
1. **Create new POST request**
2. **URL**: Your webhook URL
3. **Headers**: `Content-Type: application/json`
4. **Body**: Raw JSON with your test data

## 🔧 **Step 7: Make.com Scenario Setup**

### Basic Webhook Setup:
1. **Add Webhook module** to your scenario
2. **Configure as HTTP webhook**
3. **Set method to POST**
4. **Set content type to JSON**
5. **Add data structure** (JSON or Auto-detect)

### Variable Mapping:
1. **After receiving webhook data**, add a **Set Variable** module
2. **Map the incoming data** to variables:
   - `clientSlug` → `{{webhook.clientSlug}}`
   - `action` → `{{webhook.action}}`
   - `timestamp` → `{{webhook.timestamp}}`

## 📋 **Step 8: Debugging Checklist**

- [ ] **Webhook URL is correct**
- [ ] **Scenario is active and running**
- [ ] **Webhook module is configured for POST/JSON**
- [ ] **Data structure is set correctly**
- [ ] **Test payload is being sent**
- [ ] **Make.com logs show incoming data**
- [ ] **Variables are properly mapped**

## 🚨 **If Still Not Working**

1. **Check Make.com status** - ensure service is up
2. **Verify webhook URL** - copy from Make.com exactly
3. **Test with different content types** (JSON vs Form)
4. **Check browser network tab** for CORS issues
5. **Try creating a new webhook** in Make.com

## 📞 **Next Steps**

Once you can see the `clientSlug` in Make.com:

1. **Map it to a variable** in your scenario
2. **Use it to filter data** from your data source
3. **Test the full flow** with real data
4. **Configure response** to return lead data

The key is getting the webhook to receive and parse the JSON data correctly first, then building your automation logic around it. 