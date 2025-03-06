import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Scan, Check, CreditCard, AlertCircle, Zap } from "lucide-react";

export function DepositInstructions() {
    const steps = [
        {
            title: "Select Payment Method",
            text: "Choose your preferred payment option from the list"
        },
        {
            title: "Choose QR Code",
            text: "Click on any QR code to enlarge it"
        },
        {
            title: "Make Payment",
            text: "Scan the QR code with your payment app or use the bank details"
        },
        {
            title: "Submit Request",
            text: "After payment click \"Create Payment Request\""
        },
    ];

    return (
        <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-xl text-white mb-4">How It Works</h3>

            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#2C73D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="font-bold text-white">{index + 1}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{step.title}</h4>
                            <p className="text-[#8EACCD] text-sm">{step.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}