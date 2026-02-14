import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Heart } from 'lucide-react';

export default function PaymentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ncrl-blue">Payment Options</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-sm text-muted-foreground">
          Contribute to our community through maintenance fees and welfare fund contributions.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-ncrl-emerald/20">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-ncrl-emerald/10 p-3">
                  <CreditCard className="h-6 w-6 text-ncrl-emerald" />
                </div>
                <h3 className="text-lg font-semibold text-ncrl-blue">Maintenance Fees</h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Regular maintenance fees for community upkeep and services.
              </p>
              <Button className="w-full bg-ncrl-emerald hover:bg-ncrl-emerald/90">
                Pay Maintenance Fee
              </Button>
            </CardContent>
          </Card>

          <Card className="border-ncrl-gold/20">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-ncrl-gold/10 p-3">
                  <Heart className="h-6 w-6 text-ncrl-gold" />
                </div>
                <h3 className="text-lg font-semibold text-ncrl-blue">Welfare Fund Contributions</h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Voluntary contributions to support community welfare initiatives.
              </p>
              <Button className="w-full bg-ncrl-gold text-ncrl-blue hover:bg-ncrl-gold/90">
                Contribute to Welfare Fund
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Payment gateway integration coming soon. For now, please contact the association office for payment details.
        </p>
      </CardContent>
    </Card>
  );
}
