import {
  type BookingRecord,
  type WhatsAppDeliveryStatus,
  formatAdminConfirmedWhatsAppMessage,
  formatE164WhatsAppPhone,
} from '../utils/bookingLogic.ts';

export interface WhatsAppSendResult {
  status: WhatsAppDeliveryStatus;
  messageId: string | null;
  timestamp: string;
  error: string | null;
}

export function getWhatsAppCloudConfig(): {
  configured: boolean;
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
  templateName: string;
} {
  const accessToken = (process.env.WHATSAPP_CLOUD_API_TOKEN || '').trim();
  const phoneNumberId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
  const apiVersion = (process.env.WHATSAPP_API_VERSION || 'v21.0').trim();
  const templateName = (process.env.WHATSAPP_TEMPLATE_NAME || '').trim();

  const validToken =
    accessToken.length > 20 &&
    !accessToken.includes('MY_WHATSAPP') &&
    !accessToken.includes('YOUR_WHATSAPP');
  const validPhoneId =
    /^\d{6,25}$/.test(phoneNumberId) &&
    !phoneNumberId.includes('MY_PHONE_NUMBER_ID');

  return {
    configured: Boolean(validToken && validPhoneId),
    accessToken,
    phoneNumberId,
    apiVersion,
    templateName,
  };
}

/**
 * Sends a WhatsApp appointment confirmation message via the official Meta WhatsApp Business Cloud API.
 * Never exposes tokens to the frontend, and never fakes a "Sent" status when credentials are missing.
 */
export async function sendWhatsAppCloudConfirmation(
  booking: BookingRecord,
  customFetch: typeof fetch = fetch
): Promise<WhatsAppSendResult> {
  const timestamp = new Date().toISOString();
  const cfg = getWhatsAppCloudConfig();

  if (!cfg.configured) {
    return {
      status: 'Not Configured',
      messageId: null,
      timestamp,
      error:
        'WhatsApp Business Cloud API is not configured. Set WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in server environment variables.',
    };
  }

  const recipientPhone = formatE164WhatsAppPhone(
    booking.whatsapp_number || booking.phone
  );

  if (!recipientPhone || recipientPhone.length < 10) {
    return {
      status: 'Failed',
      messageId: null,
      timestamp,
      error: 'Customer WhatsApp phone number is invalid or missing.',
    };
  }

  const endpoint = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  const messageText = formatAdminConfirmedWhatsAppMessage(booking);

  const requestBody = cfg.templateName
    ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'template',
        template: {
          name: cfg.templateName,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: booking.customer_name },
                { type: 'text', text: booking.booking_id },
                { type: 'text', text: booking.service_name },
                { type: 'text', text: `${booking.appointment_date} at ${booking.appointment_time}` },
                { type: 'text', text: booking.location_name },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      };

  try {
    const response = await customFetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = (await response.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string; code?: number };
    };

    if (!response.ok) {
      const apiError =
        data?.error?.message ||
        `WhatsApp Cloud API returned HTTP ${response.status}`;
      return {
        status: 'Failed',
        messageId: null,
        timestamp,
        error: apiError,
      };
    }

    const messageId = data?.messages?.[0]?.id || `wamid.${Date.now()}`;
    return {
      status: 'Sent',
      messageId,
      timestamp,
      error: null,
    };
  } catch (err: unknown) {
    return {
      status: 'Failed',
      messageId: null,
      timestamp,
      error:
        err instanceof Error
          ? `Network error contacting WhatsApp Cloud API: ${err.message}`
          : 'Unknown WhatsApp Cloud API error.',
    };
  }
}
