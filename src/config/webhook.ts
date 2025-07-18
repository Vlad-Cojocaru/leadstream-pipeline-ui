import { leadApiService } from '../services/leadApiService';
import { webhookClient } from '../services/webhookClient';

const DEFAULT_FETCH_LEADS_WEBHOOK = 'https://hook.us2.make.com/htmv8xfnozjbvwyuej4tv7d3up9k47ne';
const DEFAULT_UPDATE_LEAD_WEBHOOK = 'https://hook.us2.make.com/dnkokdhfqhwg6l7mwbx8809p8pl283tw';

export function initializeWebhooks() {
  // Get webhook URLs from environment variables, or use defaults
  const sheetUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || null;
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || null;
  const makeFetchLeadsWebhookUrl = import.meta.env.VITE_MAKE_FETCH_LEADS_WEBHOOK_URL || DEFAULT_FETCH_LEADS_WEBHOOK;
  const makeUpdateLeadWebhookUrl = import.meta.env.VITE_MAKE_UPDATE_LEAD_WEBHOOK_URL || DEFAULT_UPDATE_LEAD_WEBHOOK;

  // Initialize Lead API service with webhook URLs
  leadApiService.setCredentials(sheetUrl, apiKey, makeFetchLeadsWebhookUrl, makeUpdateLeadWebhookUrl);
  
  // Initialize webhook client with Make.com webhook URL
  if (makeUpdateLeadWebhookUrl) {
    webhookClient.setMakeWebhook(makeUpdateLeadWebhookUrl);
  }

  // Log webhook configuration status
  console.log('Webhook Configuration:');
  console.log('- Make.com Fetch Leads Webhook:', makeFetchLeadsWebhookUrl);
  console.log('- Make.com Update Lead Webhook:', makeUpdateLeadWebhookUrl);
  console.log('- Google Sheets URL:', sheetUrl ? 'Configured' : 'Not configured');
} 