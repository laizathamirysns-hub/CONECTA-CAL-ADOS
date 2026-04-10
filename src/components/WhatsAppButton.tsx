/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({ phoneNumber, message = '', className = '' }: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <Button 
      onClick={handleClick}
      className={`bg-green-600 hover:bg-green-700 text-white font-bold ${className}`}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Falar no WhatsApp
    </Button>
  );
}
