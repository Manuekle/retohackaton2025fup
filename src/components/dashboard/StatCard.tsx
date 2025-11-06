import { Card, CardContent } from "@/components/ui/card";
import {
  LucideIcon,
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

type IconName =
  | "dollar-sign"
  | "shopping-bag"
  | "shopping-cart"
  | "credit-card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: IconName;
}

const iconMap: Record<IconName, LucideIcon> = {
  "dollar-sign": DollarSign,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  "credit-card": CreditCard,
};

export function StatCard({ title, value, description, icon }: StatCardProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {IconComponent && (
            <div className="rounded-lg bg-primary/10 p-3">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
