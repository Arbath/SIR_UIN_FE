import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosInstance";


const FinalApproval = () => {
  const { toast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  /* ================= FETCH DATA ================= */
  const fetchReservations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/reservations/", {
        params: {
          status: "PENDING",
          ordering: "-created_at",
        },
      });

      setRequests(res.data.results || []);
      setPendingCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
      toast({
        title: "Gagal",
        description: "Tidak dapat memuat data reservasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  
  /* ================= ACTIONS ================= */
  const handleApprove = async (id) => {
    try {
      await api.patch(`/reservations/${id}/`, {
        status: "APPROVED",
      });

      toast({
        title: "Berhasil",
        description: "Reservasi disetujui",
      });

      fetchReservations();
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Tidak bisa menyetujui reservasi",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/reservations/${id}/`, {
        status: "DECLINED"
      });

      setSelectedRequest(null);
      setRejectionReason("");

      toast({
        title: "Ditolak",
        description: "Reservasi berhasil ditolak",
      });

      fetchReservations();
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Tidak bisa menolak reservasi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 mt-6 ml-6">
        <h1 className="text-3xl font-bold">Persetujuan Akhir Reservasi</h1>
        <p className="text-muted-foreground mt-1 max-w-xl opacity-90">
          Validasi final permohonan yang perlu disetujui
          staf administrasi sebelum reservasi diaktifkan.
        </p>
      </div>

      {loading && <p>Memuat data...</p>}
      
      <div className="container mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Menunggu Validasi</p>
                  <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disetujui Hari Ini</p>
                  <p className="text-2xl font-bold text-success">7</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ditolak Hari Ini</p>
                  <p className="text-2xl font-bold text-destructive">2</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {!loading && requests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                Tidak ada reservasi pending
              </h3>
            </CardContent>
          </Card>
        )}
          

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                    {request.requester_name}
                  <StatusBadge className="ml-6 mt-2" status={request.status.toLowerCase()} />
                </CardTitle>
                <CardDescription className="mt-1 ml-7">
                  {request.requester_email}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Room & Schedule Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-medium text-primary mb-3">Detail Reservasi</h4>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{request.room_name}</p>
                            <p className="text-sm text-muted-foreground">{request.location_name}</p>
                            <p className="text-sm text-muted-foreground">Kapasitas diminta: {request.requested_capacity} orang</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                          <span className="font-medium mr-2">Tanggal:</span>
                          <span>{new Date(request.start).toLocaleDateString("id-ID")}</span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                          <span className="font-medium mr-2">Waktu:</span>
                          <span>{new Date(request.start).toLocaleTimeString("id-ID")} - {new Date(request.end).toLocaleTimeString("id-ID")}</span>
                        </div>

                        <div className="flex items-start">
                          <FileText className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium mb-1">Tujuan Penggunaan:</p>
                            <p className="text-sm">{request.purpose}</p>
                          </div>
                        </div>

                        {/* Approval Flow */}
                        <div className="p-3 bg-muted rounded-lg">
                          <h5 className="font-medium mb-2">Riwayat Persetujuan</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-success" />
                              <span>Diajukan pada: {new Date(request.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-warning" />
                              <span className="font-medium">Menunggu persetujuan admin</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary mb-3">Validasi Admin</h4>
                      <div className="space-y-3">
                        <Button 
                          className="w-full" 
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Setujui
                        </Button>

                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => setSelectedRequest(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Tolak
                        </Button>
                      </div>
                    </div>

                    {selectedRequest === request.id && (
                      <div className="space-y-3 p-4 bg-muted rounded-lg">
                        <div className="flex justify-between gap-3">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleReject(request.id)}
                          >
                            Konfirmasi Tolak
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedRequest(null);
                              setRejectionReason("");
                            }}
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* System Checks */}
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <h5 className="font-medium mb-2">Cek Sistem</h5>
                        <div className="space-y-1">
                          <div className="flex items-center text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Konflik Jadwal: Aman</span>
                          </div>
                          <div className="flex items-center text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Maintenance: Tidak Ada</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalApproval;


