import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  TrendingUp,
  Star,
  AlertCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axiosInstance"; // axios instance

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  const [stats, setStats] = useState({
    totalRooms: 0,
    totalReservations: 0,
    pendingApprovals: 0,
    activeReservations: 0,
  });

  const [recentReservations, setRecentReservations] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getLatestData = ({
    data = [],
    dateKey = "created_at",
    limit = 3,
  }) => {
    if (!Array.isArray(data)) return [];

    return [...data]
      .sort(
        (a, b) =>
          new Date(b[dateKey]) - new Date(a[dateKey])
      )
      .slice(0, limit);
  };

  const fetchAllPages = async (endpoint) => {
    let allData = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const res = await api.get(endpoint, {
        params: { page },
      });

      allData = allData.concat(res.data.results);
      hasNext = !!res.data.next;
      page++;
    }

    return allData;
  };

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, reservationsRes, feedbackRes] = await Promise.all([
        fetchAllPages("/rooms/"),
        fetchAllPages("/reservations/"),
        fetchAllPages("/feedback/"),
      ]);

      const rooms = roomsRes;
      const reservations = reservationsRes;
      const feedbacks = feedbackRes;

      // ================= STATISTICS =================
      const pending = reservations.filter(
        (r) => r.status === "PENDING"
      ).length;

      const active = reservations.filter(
        (r) => r.status === "active"
      ).length;

      setStats({
        totalRooms: rooms.length,
        totalReservations: reservations.length,
        pendingApprovals: pending,
        activeReservations: active,
      });
      
      // ================= RECENT FEEDBACK =================
      const recentFeedback = getLatestData({
        data: feedbacks,
        dateKey: "created_at",
        limit: 4,
      });

      setRecentFeedback(recentFeedback);

      const recentReservations = getLatestData({
        data: reservations,
        dateKey: "created_at",
        limit: 5,
      });

      setRecentReservations(recentReservations);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  const StarRating = ({ rating }) => (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            className={s <= rating ? "text-yellow-500" : "text-gray-300"}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang, Staff {user}
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Ruangan
              </p>
              <p className="text-3xl font-bold text-primary">
                {stats.totalRooms}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Reservasi
              </p>
              <p className="text-3xl font-bold text-info">
                {stats.totalReservations}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-info" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Persetujuan Tertunda
              </p>
              <p className="text-3xl font-bold text-warning">
                {stats.pendingApprovals}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-warning" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TOP ROOMS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Reservasi Aktif Hari Ini
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/approvals")}
              >
                Detail
              </Button>
            </CardTitle>
            <p className="text-[13px]">Daftar pengajuan reservasi yang masih dalam status pending</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentReservations.filter((res) => res.status === "PENDING").map((res) => (
              <div
                key={res.id}
                className="flex justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium mt-1 mb-2">{res.room_name}</p>
                  <p className="font-medium mb-3">{res.requester_name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span>{res.start.split("T")[0]}</span>
                  </p>
                </div>
                <div className="flex items-center">
                <StatusBadge status={res.status.toLowerCase()} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FEEDBACK */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-warning" />
                Feedback Terbaru
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/management/feedback")}
              >
                Lihat Semua
              </Button>
            </CardTitle>
            <p className="text-[13px]">Feedback terbaru dari pengguna ruangan</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentFeedback.map((fb) => (
              <div
                key={fb.id}
                className="p-3 border rounded-lg"
              >
                <div className="flex justify-between mb-1">
                  <div>
                    <p className="font-medium">{fb.reservation_room}</p>
                    <p className="text-sm text-muted-foreground">
                      dipinjam oleh: {fb.user_name}
                    </p>
                  </div>
                  <StarRating
                    rating={fb.rating}
                  />
                </div>
                <p className="text-sm font-medium mt-2">"{fb.text}"</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ({new Date(fb.created_at).toLocaleDateString(
                    "id-ID"
                  )})
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
