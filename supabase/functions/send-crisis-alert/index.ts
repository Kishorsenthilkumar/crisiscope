
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import Twilio from "npm:twilio@4.23.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

// Check if the accountSid starts with "AC" as required by Twilio
let twilioClient = null;
if (accountSid && authToken && accountSid.startsWith('AC')) {
  try {
    twilioClient = Twilio(accountSid, authToken);
    console.log("Twilio client initialized successfully");
  } catch (error) {
    console.error("Error initializing Twilio client:", error);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CrisisAlertRequest {
  email: string;
  subject: string;
  message: string;
  recipients: {
    authorities: boolean;
    ngos: boolean;
    media: boolean;
  };
  crisisType: string;
  regionName: string;
  severity: string;
  // SMS-related fields
  sendSms: boolean;
  phoneNumbers: string[];
  smsRecipients: {
    authorities: boolean;
    ngos: boolean;
    media: boolean;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      subject, 
      message, 
      recipients, 
      crisisType,
      regionName,
      severity,
      sendSms,
      phoneNumbers,
      smsRecipients 
    }: CrisisAlertRequest = await req.json();

    // Create recipient list - always include the specified email
    const recipientList = [email];

    // Add additional recipients based on selections (using mock addresses for demo)
    if (recipients.authorities) {
      recipientList.push("authorities@crisisscope-demo.com");
    }
    if (recipients.ngos) {
      recipientList.push("relief-ngos@crisisscope-demo.com");
    }
    if (recipients.media) {
      recipientList.push("media-outlets@crisisscope-demo.com");
    }

    // Format timestamp
    const timestamp = new Date().toLocaleString();

    // Create HTML email with better formatting
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: ${getSeverityColor(severity)}; color: white; padding: 10px 15px; border-radius: 4px 4px 0 0; margin: -20px -20px 20px;">
          <h1 style="margin: 0; font-size: 20px;">${subject}</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Crisis Alert: ${severity.toUpperCase()} SEVERITY</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <p style="white-space: pre-line; margin: 0 0 15px;">${message}</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; font-size: 16px;">Alert Details</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Crisis Type:</strong> ${crisisType}</li>
            <li><strong>Region:</strong> ${regionName}</li>
            <li><strong>Severity:</strong> ${severity}</li>
            <li><strong>Timestamp:</strong> ${timestamp}</li>
          </ul>
        </div>
        
        <div style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px;">
          <p>This is a crisis alert notification from CrisisScope. Please take appropriate action based on the severity level.</p>
          <p>If this alert was sent in error, please reply to this email.</p>
        </div>
      </div>
    `;

    console.log("Sending crisis alert email to:", recipientList);
    
    // Send email alert
    let emailResponse = null;
    try {
      emailResponse = await resend.emails.send({
        from: "Crisis Alerts <notifications@resend.dev>",
        to: recipientList,
        subject: subject,
        html: htmlContent,
      });
      console.log("Email response:", emailResponse);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      emailResponse = { error: emailError.message || "Failed to send email" };
    }

    // Send SMS alerts if enabled and Twilio is configured
    let smsResponses = [];
    if (sendSms) {
      console.log("SMS sending requested. Twilio client available:", !!twilioClient);
      
      if (twilioClient) {
        console.log("Sending SMS alerts");
        
        // Create SMS recipient list
        const smsNumberList = [...phoneNumbers]; // Start with provided numbers
        
        // Add mock numbers for organization types based on selections
        if (smsRecipients?.authorities) {
          smsNumberList.push("+18005551234"); // Mock authority number
        }
        if (smsRecipients?.ngos) {
          smsNumberList.push("+18005555678"); // Mock NGO number
        }
        if (smsRecipients?.media) {
          smsNumberList.push("+18005559012"); // Mock media number
        }
        
        // Format a simpler message for SMS
        const smsText = `CRISIS ALERT (${severity.toUpperCase()}): ${crisisType} crisis in ${regionName}. ${message.substring(0, 100)}${message.length > 100 ? '...' : ''} - CrisisScope`;
        
        // Send SMS messages
        for (const number of smsNumberList) {
          try {
            const smsResponse = await twilioClient.messages.create({
              body: smsText,
              to: number,
              from: twilioPhoneNumber,
            });
            smsResponses.push({
              to: number,
              status: smsResponse.status,
              sid: smsResponse.sid
            });
            console.log(`SMS sent to ${number} with SID: ${smsResponse.sid}`);
          } catch (smsError) {
            console.error(`Failed to send SMS to ${number}:`, smsError);
            smsResponses.push({
              to: number,
              status: 'failed',
              error: smsError.message || "Unknown SMS error"
            });
          }
        }
      } else {
        console.warn("SMS sending was requested but Twilio is not configured correctly");
        smsResponses = [{ status: "error", message: "Twilio not configured correctly" }];
      }
    }

    return new Response(JSON.stringify({ 
      email: emailResponse,
      sms: sendSms ? { 
        sent: twilioClient !== null,
        responses: smsResponses 
      } : null 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-crisis-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to get color based on severity
function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'extreme': return '#dc2626'; // red-600
    case 'high': return '#ef4444';    // red-500
    case 'medium': return '#f97316';  // orange-500
    case 'low': return '#22c55e';     // green-500
    default: return '#3b82f6';        // blue-500
  }
}

serve(handler);
