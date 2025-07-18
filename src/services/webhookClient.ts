
export interface StageUpdatePayload {
  leadId: string;
  currentStage: string;
  newStage: string;
  timestamp: string;
  source: string;
}

export class WebhookClient {
  private static instance: WebhookClient;
  private goHighLevelWebhook: string | null = null;
  private makeWebhook: string | null = null;

  static getInstance(): WebhookClient {
    if (!WebhookClient.instance) {
      WebhookClient.instance = new WebhookClient();
    }
    return WebhookClient.instance;
  }

  setGoHighLevelWebhook(url: string) {
    this.goHighLevelWebhook = url;
  }

  setMakeWebhook(url: string) {
    this.makeWebhook = url;
  }

  async updateLeadStage(payload: StageUpdatePayload): Promise<boolean> {
    const results = await Promise.allSettled([
      this.sendToGoHighLevel(payload),
      this.sendToMake(payload)
    ]);

    // Return true if at least one webhook succeeded
    return results.some(result => result.status === 'fulfilled');
  }

  private async sendToGoHighLevel(payload: StageUpdatePayload): Promise<void> {
    if (!this.goHighLevelWebhook) {
      console.log('GoHighLevel webhook not configured');
      return;
    }

    try {
      const response = await fetch(this.goHighLevelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...payload,
          platform: 'GoHighLevel',
          action: 'update_stage'
        }),
      });

      console.log('GoHighLevel webhook triggered successfully');
    } catch (error) {
      console.error('Error sending to GoHighLevel:', error);
      throw error;
    }
  }

  private async sendToMake(payload: StageUpdatePayload): Promise<void> {
    if (!this.makeWebhook) {
      console.log('Make.com webhook not configured');
      return;
    }

    try {
      const response = await fetch(this.makeWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...payload,
          platform: 'Make',
          action: 'update_stage'
        }),
      });

      console.log('Make.com webhook triggered successfully');
    } catch (error) {
      console.error('Error sending to Make:', error);
      throw error;
    }
  }

  // Removed testWebhook method as part of webhook testing cleanup
}

export const webhookClient = WebhookClient.getInstance();
