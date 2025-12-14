import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosInstance";
import {
  MapPin,
  Users,
  Filter,
  FileText,
  Send,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 7; h <= 19; h++) {
    for (let m of [0, 30]) {
      if (h === 19 && m === 30) continue;
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return times;
};
const timeOptions = generateTimeOptions();

const ReservationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const roomIdFromQuery = searchParams.get("roomId");

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({
    room: "",
    purpose: "",
    requested_capacity: "",
    status: "PENDING",
  });
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const start = date && startTime ? `${date}T${startTime}` : "";
  const end = date && endTime ? `${date}T${endTime}` : "";

  // ================= ROOM STATE =================
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ================= FILTER =================
  const [location, setLocation] = useState("");
  const [roomName, setRoomName] = useState("");

  // ================= PAGINATION =================
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
    next: null,
    previous: null,
  });

  // ================= SET ROOM FROM QUERY =================
  useEffect(() => {
    if (roomIdFromQuery) {
      setFormData((prev) => ({
        ...prev,
        room: Number(roomIdFromQuery),
      }));
      setIsFiltered(false);

      // fetch detail room
      const fetchRoomDetail = async () => {
        try {
          const res = await api.get(`/rooms/${roomIdFromQuery}/`);
          setSelectedRoom(res.data);
        } catch (err) {
          console.error("Gagal ambil detail room:", err);
        }
      };
      fetchRoomDetail();
    }
    else if (!roomIdFromQuery) {
      // reset formData dan selectedRoom jika tidak ada roomId di query
      setFormData((prev) => ({
        ...prev,
        room: "",
        purpose: "",
        requested_capacity: "",
      }));
      setSelectedRoom(null);
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  }, [roomIdFromQuery]);

  // ================= FETCH ROOMS =================
  const fetchRooms = async (page = 1) => {
    setLoadingRooms(true);
    try {
      const res = await api.get("/rooms/", {
        params: {
          page,
          search: roomName || undefined,
          location: location || undefined,
        },
      });

      setRooms(res.data.results || []);
      setPagination({
        page,
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
      });
      setIsFiltered(true);
    } catch (err) {
      console.error("Gagal mengambil rooms:", err);
      toast({
        title: "Gagal memuat data ruangan",
        variant: "destructive",
      });
    } finally {
      setLoadingRooms(false);
    }
  };

  // ================= FORM HANDLER =================
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room || !start || !end || !formData.purpose || !formData.requested_capacity) {
      toast({
        title: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    const role = localStorage.getItem("role");
    const payload = {
      room: formData.room,
      purpose: formData.purpose,
      requested_capacity: Number(formData.requested_capacity),
      status: "PENDING",
      start,
      end,
    };

    try {
      await api.post("/reservations/", payload);

      toast({
        title: "Reservasi berhasil diajukan",
        variant: "success",
      });

      navigate(`/${role}/status`);
    } catch (err) {
      console.error("Gagal reservasi:", err);
      toast({
        title: "Gagal mengajukan reservasi",
        description: err.response?.data?.detail || "Kesalahan server",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Ajukan Reservasi Ruangan</h1>
        <p className="text-muted-foreground">Lengkapi form reservasi</p>
      </div>

      {/* FILTER */}
      {!roomIdFromQuery && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter Ruangan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input
                  placeholder="Contoh: Gedung Teknik"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nama Ruangan</Label>
                <Input
                  placeholder="Contoh: Lab Komputer"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <Button onClick={() => fetchRooms(1)}>Terapkan</Button>

              <Button
                variant="outline"
                onClick={() => {
                  setLocation("");
                  setRoomName("");
                  setRooms([]);
                  setIsFiltered(false);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROOMS */}
      {!roomIdFromQuery && isFiltered && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Pilih Ruangan
            </CardTitle>
            <CardDescription>Klik salah satu ruangan untuk melanjutkan reservasi</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRooms ? (
              <p>Memuat ruangan...</p>
            ) : rooms.length === 0 ? (
              <p className="text-muted-foreground">Tidak ada ruangan ditemukan</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`cursor-pointer border-2 transition-all ${
                      formData.room === room.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                    onClick={() => handleInputChange("room", room.id)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-bold">{room.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {room.location_name || room.location}
                      </p>
                      {formData.room === room.id && <Badge className="mt-2">Dipilih</Badge>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected room info */}
      {selectedRoom && (
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <h4 className="font-bold">{selectedRoom.name}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {selectedRoom.location_name}
            </p>
            <p className="text-sm mt-1">Kapasitas: {selectedRoom.capacity} orang</p>
          </CardContent>
        </Card>
      )}

      {/* FORM */}
      {formData.room && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Form Reservasi
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tujuan Penggunaan</Label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                />
              </div>

              <div>
                <Label>Tanggal</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Waktu Mulai</Label>
                  <select className="w-full border rounded-md h-10 px-3" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    <option value="">Pilih jam</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Waktu Selesai</Label>
                  <select
                    className="w-full border rounded-md h-10 px-3"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <option value="">Pilih jam</option>
                    {timeOptions.filter((t) => t > startTime).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Jumlah Peserta</Label>
                <Input
                  type="number"
                  value={formData.requested_capacity}
                  onChange={(e) => handleInputChange("requested_capacity", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Ajukan Reservasi
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReservationForm;
