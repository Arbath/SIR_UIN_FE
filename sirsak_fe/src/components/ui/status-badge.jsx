import { cn } from "@/lib/utils";



export function StatusBadge({  status, className  }) {
  const variants = {
    available: "bg-room-available text-white",
    occupied: "bg-room-occupied text-white", 
    pending: "bg-room-pending text-white",
    approved: "bg-success text-success-foreground",
    declined: "bg-destructive text-destructive-foreground",
    maintenance: "bg-warning text-warning-foreground",
  };

  const labels = {
    available: "Tersedia",
    occupied: "Terisi",
    pending: "Pending",
    approved: "Disetujui", 
    declined: "Ditolak",
    maintenance: "Maintenance",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}


