import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitContactForm } from '../../hooks/useQueries';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const submitContact = useSubmitContactForm();

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitStatus('idle');
      const message = `Subject: ${data.subject}\n\n${data.message}`;
      const date = new Date().toISOString().split('T')[0];
      await submitContact.mutateAsync({
        name: data.name,
        email: data.email,
        message,
        date,
      });
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitStatus === 'success' && (
        <Alert className="border-ncrl-emerald bg-ncrl-emerald/10">
          <CheckCircle2 className="h-4 w-4 text-ncrl-emerald" />
          <AlertDescription className="text-ncrl-emerald">
            Your message has been sent successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to send message. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          {...register('subject', { required: 'Subject is required' })}
          placeholder="Message subject"
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register('message', { required: 'Message is required' })}
          placeholder="Your message or query"
          rows={5}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitContact.isPending}
        className="w-full bg-ncrl-emerald hover:bg-ncrl-emerald/90"
      >
        {submitContact.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
}
