
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import Twilio from "npm:twilio@4.23.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

// Improved Twilio client initialization with better error handling
let twilioClient = null;
let twilioErrorMessage = null;
let twilioConfigured = false;

try {
  if (accountSid && authToken && twilioPhoneNumber) {
    // Validate credentials format - we just check basic patterns here
    if (!accountSid.startsWith('AC')) {
      twilioErrorMessage = "Invalid Twilio Account SID format - must start with 'AC'";
      console.error(twilioErrorMessage);
    } else if (!twilioPhoneNumber.startsWith('+')) {
      twilioErrorMessage = "Invalid Twilio Phone Number - must start with '+' followed by country code";
      console.error(twilioErrorMessage);
    } else if (authToken.length < 10) {
      twilioErrorMessage = "Invalid Twilio Auth Token - token seems too short";
      console.error(twilioErrorMessage);
    } else {
      // All conditions met, initialize Twilio client
      try {
        twilioClient = Twilio(accountSid, authToken);
        twilioConfigured = true;
        console.log("Twilio client initialized successfully");
      } catch (initError) {
        twilioErrorMessage = `Failed to initialize Twilio client: ${initError.message}`;
        console.error(twilioErrorMessage);
      }
      
      // Do a test fetch of account info to validate credentials, but don't block the main flow
      (async () => {
        try {
          console.log("Verifying Twilio account credentials...");
          const account = await twilioClient.api.accounts(accountSid).fetch();
          if (account.status === 'active') {
            console.log(`Verified Twilio account: ${account.friendlyName}`);
          } else {
            twilioErrorMessage = `Twilio account is not active (status: ${account.status})`;
            twilioConfigured = false;
            console.warn(twilioErrorMessage);
          }
        } catch (verifyError) {
          twilioConfigured = false;
          console.error("Twilio verification error:", verifyError);
          
          if (verifyError.code === 20003 || (verifyError.message && verifyError.message.includes('authenticate'))) {
            twilioErrorMessage = "Invalid Twilio credentials. Please check your Account SID and Auth Token.";
          } else {
            twilioErrorMessage = `Twilio authentication failed: ${verifyError.message || 'Unknown error'}`;
          }
          console.error(twilioErrorMessage);
        }
      })();
    }
  } else {
    // Log which credentials are missing
    const missingCredentials = [];
    if (!accountSid) missingCredentials.push("TWILIO_ACCOUNT_SID");
    if (!authToken) missingCredentials.push("TWILIO_AUTH_TOKEN");
    if (!twilioPhoneNumber) missingCredentials.push("TWILIO_PHONE_NUMBER");
    
    twilioErrorMessage = `SMS functionality disabled - missing Twilio credentials: ${missingCredentials.join(", ")}`;
    console.log(twilioErrorMessage);
  }
} catch (error) {
  twilioErrorMessage = `Failed to initialize Twilio client: ${error.message}`;
  console.error(twilioErrorMessage);
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

    // Special case for configuration check
    if (crisisType === "check") {
      console.log("Configuration check requested");
      // Log full details of Twilio configuration for debugging
      console.log("Twilio details:", {
        accountSid: accountSid ? `${accountSid.substring(0, 4)}...` : null,
        authToken: authToken ? "provided" : null,
        phoneNumber: twilioPhoneNumber,
        configured: twilioConfigured,
        errorMessage: twilioErrorMessage
      });
      
      return new Response(JSON.stringify({ 
        email: { 
          configured: Boolean(Deno.env.get("RESEND_API_KEY")),
          error: null
        },
        sms: { 
          sent: false,
          configured: twilioConfigured,
          errorMessage: twilioErrorMessage,
          responses: [],
          twilioPhone: twilioPhoneNumber ? `${twilioPhoneNumber.substring(0, 4)}...` : null
        } 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

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
    let smsSent = false;
    
    if (sendSms) {
      console.log(`SMS sending requested. Twilio client available: ${twilioConfigured}`);
      
      if (twilioConfigured && twilioClient) {
        console.log("Sending SMS alerts with phone number:", twilioPhoneNumber);
        
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
        try {
          for (const number of smsNumberList) {
            try {
              console.log(`Attempting to send SMS to ${number} from ${twilioPhoneNumber}`);
              
              // Try to verify the phone number's format before sending
              if (!number || !number.match(/^\+[1-9]\d{1,14}$/)) {
                throw new Error(`Invalid phone number format: ${number}. Must use E.164 format starting with +`);
              }
              
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
              smsSent = true;
            } catch (smsError) {
              console.error(`Failed to send SMS to ${number}:`, smsError);
              smsResponses.push({
                to: number,
                status: 'failed',
                error: smsError.message || "Unknown SMS error"
              });
              
              // Update the twilioErrorMessage if authentication failed
              if (smsError.message?.includes('authenticate') || smsError.code === 20003) {
                twilioErrorMessage = "Authentication failed. Please check your Twilio account SID and auth token.";
                twilioConfigured = false;
              } else if (smsError.code === 21211) {
                // Invalid 'To' phone number
                console.error("Invalid destination phone number format");
              } else if (smsError.code === 21606) {
                // Invalid 'From' phone number
                twilioErrorMessage = "The Twilio phone number is invalid or not enabled for SMS. Check your account.";
                twilioConfigured = false;
              }
            }
          }
        } catch (bulkSmsError) {
          console.error("Failed to process SMS batch:", bulkSmsError);
          twilioErrorMessage = `SMS sending failed: ${bulkSmsError.message}`;
        }
      } else {
        console.warn(`SMS sending was requested but Twilio is not properly configured: ${twilioErrorMessage}`);
      }
    }

    // Log the final Twilio status for debugging
    console.log("Twilio final status:", { 
      configured: twilioConfigured, 
      errorMessage: twilioErrorMessage,
      smsSent: smsSent
    });

    return new Response(JSON.stringify({ 
      email: emailResponse,
      sms: sendSms ? { 
        sent: smsSent,
        configured: twilioConfigured,
        errorMessage: twilioErrorMessage,
        responses: smsResponses,
        twilioPhone: twilioPhoneNumber ? `${twilioPhoneNumber.substring(0, 4)}...` : null
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
