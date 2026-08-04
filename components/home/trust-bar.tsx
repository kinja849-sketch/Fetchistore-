import { Truck, ShieldCheck, MapPin, Headphones } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      title: "Seller Delivery",
      subtitle: "Direct to your house door",
      bg: "bg-[#8A9A5B]/10 text-[#8A9A5B]",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "Stripe, bank, e-wallet, COD",
      bg: "bg-[#D4A373]/10 text-[#D4A373]",
    },
    {
      icon: MapPin,
      title: "Near You",
      subtitle: "Proximity radius filter",
      bg: "bg-[#5C6145]/10 text-[#5C6145]",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "Order-scoped live chat",
      bg: "bg-[#8A9A5B]/10 text-[#8A9A5B]",
    },
  ];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#F6F3F2] p-5 rounded-[20px] border border-[#E4E2E1] flex flex-col items-center text-center transition-all hover:-translate-y-0.5 hover:border-[#8A9A5B]/40"
              >
                <div className={`p-3 rounded-full mb-3 ${item.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-[#333333]">{item.title}</h3>
                <p className="text-xs text-[#76786B] mt-1">{item.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
