import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin, Users, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axiosInstance";

const RoomSearch = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [capacity, setCapacity] = useState("");
  const [locationId, setLocationId] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
    next: null,
    previous: null,
  });

  // ================= FETCH LOCATIONS =================
  const fetchLocations = async () => {
    try {
      let allLocations = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await api.get("/locations/", {
          params: { page },
        });

        allLocations = allLocations.concat(res.data.results);
        hasNext = !!res.data.next;
        page++;
      }

      setLocations(allLocations);
    } catch (err) {
      console.error("Gagal mengambil data lokasi", err);
    }
  };

  // ================= FETCH ROOMS =================
  const fetchRooms = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        capacity: capacity || undefined,
        location: locationId || undefined,
      };

      const res = await api.get("/rooms/", { params });

      const roomsWithStatus = res.data.results.map((room) => ({
        ...room,
        status: "Tersedia",
      }));

      setRooms(roomsWithStatus);
      setPagination({
        page,
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
      });
    } catch (err) {
      console.error("Gagal mengambil data ruangan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchRooms(1);
  }, []);

  const role = localStorage.getItem("role");
  const handleReserve = (roomId) => {
    navigate(`/${role}/reserve?roomId=${roomId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Pencarian Ruangan</h1>
        <p className="text-muted-foreground">
          Temukan ruangan sesuai kebutuhan Anda
        </p>
      </div>

      {/* FILTER */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter Pencarian
          </CardTitle>
          <CardDescription>
            Filter berdasarkan kapasitas dan lokasi
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>Kapasitas Minimal</Label>
              <Input
                type="number"
                placeholder="Contoh: 30"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Select
                value={locationId}
                onValueChange={setLocationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.name} value={(loc.name)}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => fetchRooms(1)}>
              Terapkan
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setCapacity("");
                setLocationId("");
                fetchRooms(1);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RESULT */}
      {loading ? (
        <p className="text-muted-foreground">Memuat data...</p>
      ) : rooms.length === 0 ? (
        <p className="text-muted-foreground">
          Tidak ada ruangan ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="shadow-soft">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="mb-5">{room.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 " />
                      {room.location_name}
                    </CardDescription>
                  </div>
                  <StatusBadge status="Tersedia" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Rating: {room.rating}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  Kapasitas {room.capacity} orang
                </div>

                <Button
                  className="w-full"
                  disabled={room.status !== "Tersedia"}
                  onClick={() => handleReserve(room.id)}
                >
                  {room.status === "Tersedia"
                    ? "Reservasi"
                    : room.status === "occupied"
                    ? "Terisi"
                    : "Maintenance"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          disabled={!pagination.previous}
          onClick={() => fetchRooms(pagination.page - 1)}
        >
          Sebelumnya
        </Button>

        <span className="text-sm text-muted-foreground">
          Halaman {pagination.page} dari{" "}
          {Math.ceil(pagination.count / 10 || 1)}
        </span>

        <Button
          variant="outline"
          disabled={!pagination.next}
          onClick={() => fetchRooms(pagination.page + 1)}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
};

export default RoomSearch;
