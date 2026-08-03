import { Truck, ShieldCheck, MapPin, Headphones } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      title: "Seller Delivery",
      subtitle: "Direct to your door",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "Card, bank, e-wallet, COD",
    },
    {
      icon: MapPin,
      title: "Near You",
      subtitle: "Proximity-first discovery",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "We're here to help",
    },
  ];

  return (
    <div className="bg-surface-muted border-y border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <Icon className="text-brand w-7 h-7 mb-3" />
                <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
