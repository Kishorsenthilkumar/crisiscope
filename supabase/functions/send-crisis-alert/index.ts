
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
      severity 
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
    
    const emailResponse = await resend.emails.send({
      from: "Crisis Alerts <notifications@resend.dev>",
      to: recipientList,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email response:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-crisis-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
