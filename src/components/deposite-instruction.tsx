import { Card, CardContent } from "@/components/ui/card";

export function DepositInstructions() {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="font-medium mb-2">How to deposit</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Select your preferred payment method from the tabs above</li>
                    <li>Choose a QR code (click to enlarge)</li>
                    <li>Scan the QR code with your payment app or use the account details</li>
                    <li>After payment, click "Yes, Create Payment Request"</li>
                    <li>Enter your payment details on the request page</li>
                    <li>Your account will be credited once the payment is verified</li>
                </ol>
            </CardContent>
        </Card>
    );
}