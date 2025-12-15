import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/student/Dashboard";
import RoomSearch from "./pages/student/RoomSearch";
import ReservationForm from "./pages/student/ReservationForm";
import ReservationStatus from "./pages/student/ReservationStatus";
import Feedback from "./pages/student/Feedback";
import FacultyDashboard from "./pages/lecturer/Dashboard";
import ApprovalReservations from "./pages/lecturer/ApprovalReservations";
import ScheduleReservations from "./pages/lecturer/ScheduleReservations";
import AdminDashboard from "./pages/admin/Dashboard";
import RoomManagement from "./pages/admin/RoomManagement";
import FinalApproval from "./pages/admin/FinalApproval";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  
  // Debugging: log current path
  console.log("Current path:", location.pathname, "Is landing page:", isLandingPage);
  
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/user/dashboard" element={<StudentDashboard />} />
            <Route path="/user/search" element={<RoomSearch />} />
            <Route path="/user/reserve" element={<ReservationForm />} />
            <Route path="/user/status" element={<ReservationStatus />} />
            <Route path="/user/feedback" element={<Feedback />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<FinalApproval />} />
            <Route path="/admin/management/rooms" element={<RoomManagement />} />
            <Route path="/admin/management/users" element={<UserManagement />} />
            <Route path="/admin/reserve" element={<ReservationForm />} />
            <Route path="/admin/management/feedback" element={<NotFound />} />
            {/* <Route path="/superadmin/dashboard" element={<AdminDashboard />} />
            <Route path="/superadmin/rooms" element={<RoomManagement />} />
            <Route path="/superadmin/users" element={<UserManagement />} />
            <Route path="/superadmin/approvals" element={<FinalApproval />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


