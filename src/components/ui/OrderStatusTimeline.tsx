import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils/cn";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}

const STEPS: TimelineStep[] = [
  { status: OrderStatus.PENDING, label: "Order Placed", icon: <Clock size={16} /> },
  { status: OrderStatus.CONFIRMED, label: "Confirmed", icon: <CheckCircle2 size={16} /> },
  { status: OrderStatus.PROCESSING, label: "Processing", icon: <Package size={16} /> },
  { status: OrderStatus.SHIPPED, label: "Shipped", icon: <Truck size={16} /> },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: "Out for Delivery", icon: <MapPin size={16} /> },
  { status: OrderStatus.DELIVERED, label: "Delivered", icon: <CheckCircle2 size={16} /> },
];

const STATUS_ORDER = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt: string;
}

export default function OrderStatusTimeline({
  currentStatus,
  createdAt,
}: OrderStatusTimelineProps) {
  const isCancelled = currentStatus === OrderStatus.CANCELLED;
  const isRefunded = currentStatus === OrderStatus.REFUNDED;
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  if (isCancelled || isRefunded) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        {isCancelled ? (
          <XCircle className="text-red-600 shrink-0" size={24} />
        ) : (
          <RotateCcw className="text-orange-600 shrink-0" size={24} />
        )}
        <div>
          <p className="font-semibold text-[#0a0a0a]">
            Order {isCancelled ? "Cancelled" : "Refunded"}
          </p>
          <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative">
      {STEPS.map((step, idx) => {
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <li key={step.status} className="flex gap-4 pb-8 last:pb-0">
            {/* Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 transition-colors",
                  isCompleted
                    ? "border-[#c9a84c] bg-[#c9a84c] text-white"
                    : "border-gray-200 bg-white text-gray-400"
                )}
              >
                {step.icon}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-[2rem]",
                    isCompleted && idx < currentIndex
                      ? "bg-[#c9a84c]"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1 pb-4">
              <p
                className={cn(
                  "font-medium",
                  isCurrent ? "text-[#0a0a0a]" : isCompleted ? "text-gray-700" : "text-gray-400"
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatDate(createdAt)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
