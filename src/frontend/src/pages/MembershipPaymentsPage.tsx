import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MembershipForm from '../components/forms/MembershipForm';
import PaymentsSection from '../components/payments/PaymentsSection';

export default function MembershipPaymentsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Membership & Payments</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Join the association and contribute to our collective welfare.
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-ncrl-blue">Online Membership Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <MembershipForm />
            </CardContent>
          </Card>

          <PaymentsSection />
        </div>
      </div>
    </div>
  );
}
