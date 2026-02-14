import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitMembership } from '../../hooks/useQueries';
import { MembershipType } from '../../backend';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface MembershipFormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  message?: string;
}

export default function MembershipForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<MembershipFormData>();
  const submitMembership = useSubmitMembership();

  const onSubmit = async (data: MembershipFormData) => {
    try {
      setSubmitStatus('idle');
      await submitMembership.mutateAsync({
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        membershipType: data.membershipType,
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
            Your membership registration has been submitted successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to submit registration. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">House/Flat Identifier *</Label>
        <Input
          id="address"
          {...register('address', { required: 'Address is required' })}
          placeholder="e.g., House No. 123, Block A"
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
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
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone', { required: 'Phone is required' })}
          placeholder="+91 1234567890"
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="membershipType">Membership Type *</Label>
        <Select
          onValueChange={(value) => setValue('membershipType', value as MembershipType)}
          defaultValue={MembershipType.regular}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select membership type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MembershipType.regular}>Regular</SelectItem>
            <SelectItem value={MembershipType.premium}>Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Message (Optional)</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Any additional information or queries"
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={submitMembership.isPending}
        className="w-full bg-ncrl-emerald hover:bg-ncrl-emerald/90"
      >
        {submitMembership.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Registration'
        )}
      </Button>
    </form>
  );
}
