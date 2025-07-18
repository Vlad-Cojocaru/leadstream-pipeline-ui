# Make.com Integration Guide

## Overview
This guide explains how to set up the Make.com integration to connect your Lead Stream Pro app with Google Sheets and other services.

## Setup Steps

### 1. Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Make.com Webhook Configuration - TWO SEPARATE WEBHOOKS
VITE_MAKE_FETCH_LEADS_WEBHOOK_URL=https://hook.us2.make.com/your-fetch-leads-webhook-url
VITE_MAKE_UPDATE_LEAD_WEBHOOK_URL=https://hook.us2.make.com/your-update-lead-webhook-url

# Google Sheets Configuration (optional - for direct integration)
VITE_GOOGLE_SHEETS_URL=your_google_sheets_url_here
VITE_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
```

### 2. Make.com Webhook Setup

#### Create TWO Separate Scenarios in Make.com:

**Scenario 1: Fetch Leads Webhook**
1. **Webhook Trigger**: Set up a webhook trigger to receive `fetch_leads` requests
2. **Google Sheets Integration**: Search for rows where `Client Slug` equals the received `clientSlug`
3. **Response**: Send back the leads array

**Scenario 2: Update Lead Stage Webhook**
1. **Webhook Trigger**: Set up a webhook trigger to receive `update_lead_stage` requests
2. **Google Sheets Integration**: Update the row where `ID` equals `leadId`
3. **Response**: Send back success status

#### Webhook Actions:

**Fetch Leads Action (Scenario 1):**
```json
{
  "action": "fetch_leads",
  "clientSlug": "contractor123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Expected Response from Fetch Leads:**
```json
{
  "success": true,
  "leads": [
    {
      "id": "lead-001",
      "name": "John Smith",
      "phone": "(555) 123-4567",
      "email": "john@example.com",
      "offerType": "Kitchen Remodel",
      "currentStage": "New Lead",
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Update Lead Stage Action (Scenario 2):**
```json
{
  "action": "update_lead_stage",
  "clientSlug": "contractor123",
  "leadId": "lead-001",
  "newStage": "Contacted",
  "stageIndex": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Expected Response from Update Lead:**
```json
{
  "success": true,
  "message": "Lead stage updated successfully"
}
```

### 3. Google Sheets Structure
Your Google Sheets should have the following columns:
- **ID**: Unique identifier for each lead
- **Name**: Lead's full name
- **Phone**: Contact phone number
- **Email**: Contact email address
- **Offer Type**: Type of service/offer
- **Current Stage**: Current pipeline stage
- **Last Updated**: Timestamp of last update
- **Client Slug**: The client identifier (for filtering)

### 4. Make.com Scenario Logic

#### Scenario 1: Fetching Leads
1. **Webhook Trigger** → Receives `fetch_leads` action
2. **Google Sheets** → Search for rows where `Client Slug` equals the received `clientSlug`
3. **Set Variable** → Format the leads data
4. **Webhook Response** → Return the leads array

#### Scenario 2: Updating Lead Stage
1. **Webhook Trigger** → Receives `update_lead_stage` action
2. **Google Sheets** → Update the row where `ID` equals `leadId`
3. **Set Variable** → Prepare success response
4. **Webhook Response** → Return success status

### 5. Testing the Integration

1. **Start your app** and log in with a user that has a `clientSlug`
2. **Check the browser console** for webhook requests to both URLs
3. **Verify in Make.com** that both scenarios are receiving requests
4. **Check Google Sheets** that data is being fetched and updated correctly

### 6. Error Handling

The app includes fallback mechanisms:
- If Make.com webhook fails, it falls back to mock data
- If Google Sheets update fails, it still updates the local UI
- All errors are logged to the console for debugging

### 7. Security Considerations

- Use HTTPS for all webhook URLs
- Consider adding authentication to your Make.com webhooks
- Validate all incoming data in your Make.com scenarios
- Use environment variables for sensitive configuration

## Troubleshooting

### Common Issues:

1. **Webhook not receiving requests**: Check both webhook URLs in your `.env` file
2. **CORS errors**: Ensure your Make.com webhooks allow requests from your app's domain
3. **Data not updating**: Check the Google Sheets permissions and API key
4. **Wrong client data**: Verify the `clientSlug` mapping in your Supabase user metadata
5. **Wrong webhook called**: Ensure the correct webhook URL is being used for each action

### Debug Steps:

1. Check browser console for error messages
2. Verify both Make.com scenarios are active and receiving requests
3. Test webhook URLs directly with a tool like Postman
4. Check Google Sheets API quotas and permissions
5. Verify the webhook URLs are correctly set in your `.env` file 