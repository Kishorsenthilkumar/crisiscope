
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailFormData } from './types';

interface EmailFormProps {
  formData: EmailFormData;
  emailValid: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAuthoritiesChange: (checked: boolean) => void;
  onNGOsChange: (checked: boolean) => void;
  onMediaChange: (checked: boolean) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  formData,
  emailValid,
  onEmailChange,
  onSubjectChange,
  onMessageChange,
  onAuthoritiesChange,
  onNGOsChange,
  onMediaChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          Recipient Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={onEmailChange}
          className={!emailValid ? "border-red-500" : ""}
        />
        {!emailValid && (
          <p className="text-xs text-red-500">Please enter a valid email address</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={onSubjectChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Alert Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={onMessageChange}
          rows={4}
        />
      </div>
      
      <div className="pt-2">
        <Label className="text-sm font-medium mb-2 block">
          Additional Email Recipients
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="authorities" 
              checked={formData.sendToAuthorities}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  onAuthoritiesChange(checked);
                }
              }}
            />
            <Label htmlFor="authorities" className="text-sm font-normal cursor-pointer">
              Local Authorities
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ngos" 
              checked={formData.sendToNGOs}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  onNGOsChange(checked);
                }
              }}
            />
            <Label htmlFor="ngos" className="text-sm font-normal cursor-pointer">
              Relief NGOs
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="media" 
              checked={formData.sendToMedia}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  onMediaChange(checked);
                }
              }}
            />
            <Label htmlFor="media" className="text-sm font-normal cursor-pointer">
              Media Outlets
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
