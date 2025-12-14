import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosInstance";
import {
  ScheduleIcon,
  ClockIcon,
  LocationIcon
} from "@/components/icons/dashboard.jsx";
import {
  Star,
  Send
} from "lucide-react";
import { use } from "react";

const Feedback = () => {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("pending"); 

  const [reservations, setReservations] = useState([]);
  const [givenFeedbacks, setGivenFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feedbackData, setFeedbackData] = useState({
    reservation: "",
    rating: 0,
    text: "",
  });

  const fetchAllReservationsApproved = async () => {
    let page = 1;
    let allResults = [];
    let hasNext = true;

    while (hasNext) {
      const res = await api.get("/reservations/", {
        params: {
          page
        },
      });

      allResults = [...allResults, ...(res.data.results || [])];

      hasNext = Boolean(res.data.next);
      page += 1;
    }

    return allResults;
  };

  const fetchData = async () => {
    try {
      const [resReservations, resFeedbacks] = await Promise.all([
        fetchAllReservationsApproved(),
        api.get("/feedback/my_feedback/"),
      ]);

      const now = new Date();
      const feedbackReservationIds = resFeedbacks.data.map(
        (fb) => fb.reservation
      );

      const filteredReservations = resReservations.filter(
        (r) => {
          const endDate = new Date(r.end);
          return (
            r.status?.toLowerCase() === "approved" &&
            endDate < now &&
            !feedbackReservationIds.includes(r.id)
          );
        }
      );

      setReservations(filteredReservations);
      setGivenFeedbacks(resFeedbacks.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal memuat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const selectedReservation = reservations.find(
    (r) => r.id.toString() === feedbackData.reservation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackData.reservation || feedbackData.rating === 0) {
      toast({
        title: "Data belum lengkap",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/feedback/", feedbackData);

      toast({
        title: "Feedback berhasil dikirim",
      });

      setFeedbackData({ reservation: "", rating: 0, text: "" });

      setReservations((prev) =>
        prev.filter((r) => r.id.toString() !== feedbackData.reservation)
      );

      fetchData();

      setActiveTab("done");
    } catch (err) {
      toast({
        title: "Gagal mengirim feedback",
        variant: "destructive",
      });
    }
  };

  const StarRating = ({ rating, onChange }) => (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={s <= rating ? "text-yellow-500" : "text-gray-300"}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ml-6">
      {/* HEADER */}
      <div className="mb-6 mt-6">
        <h1 className="text-3xl font-bold">Feedback Ruangan</h1>
        <p className="text-muted-foreground mt-1 max-w-xl">
          Berikan penilaian untuk ruangan yang telah Anda gunakan.
          Masukan Anda sangat berarti bagi kami.
        </p>

        {/* TAB HEADER */}
        <div className="flex gap-6 mt-6 border-b">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Menunggu Ulasan ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab("done")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "done"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Selesai ({givenFeedbacks.length})
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        {/* ================= FORM FEEDBACK ================= */}
        {activeTab === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Form Feedback</CardTitle>
              <CardDescription>
                Pilih reservasi yang telah selesai
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Reservasi *</Label>
                  <Select
                    value={feedbackData.reservation}
                    onValueChange={(v) =>
                      setFeedbackData({ ...feedbackData, reservation: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih reservasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservations.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.room_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedReservation && (
                  <div className="p-3 bg-muted rounded">
                    <p className="font-medium">{selectedReservation.room_name}</p>
                    <p className="text-sm flex items-center gap-1">
                      <LocationIcon className="h-3 w-3" />
                      {selectedReservation.location_name}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <ScheduleIcon className="h-4 w-4 mr-1" />
                      {selectedReservation.start.split("T")[0]}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {selectedReservation.start.split("T")[1].slice(0,5)} - {selectedReservation.end.split("T")[1].slice(0,5)}
                    </p>
                  </div>
                )}
                <Label className="flex mt-1">Rating *</Label>
                <StarRating
                  rating={feedbackData.rating}
                  onChange={(r) =>
                    setFeedbackData({ ...feedbackData, rating: r })
                  }
                />

                <div>
                  <Label>Kritik dan Saran</Label>
                  <Textarea
                    value={feedbackData.text}
                    onChange={(e) =>
                      setFeedbackData({ ...feedbackData, text: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ================= RIWAYAT FEEDBACK ================= */}
        {activeTab === "done" && (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Feedback</CardTitle>
              <CardDescription>
                Feedback yang telah Anda kirim
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {givenFeedbacks.length === 0 ? (
                <p className="text-muted-foreground">
                  Belum ada feedback
                </p>
              ) : (
                givenFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-[18px]">{fb.reservation_room}</p>
                      </div>
                      <div>
                        <StarRating
                          rating={fb.rating}
                          onChange={(r) =>
                            setFeedbackData({ ...feedbackData, rating: r })
                          }
                        />
                        <p className="font-medium text-[12px]">Dinilai pada {fb.created_at.split("T")[0]}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "{fb.text || "Tanpa komentar"}"
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Feedback;
