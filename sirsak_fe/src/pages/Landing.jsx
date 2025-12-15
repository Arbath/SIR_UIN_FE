import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Users, CalendarCheck, Star, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/university-hero.jpg";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("beranda");

  useEffect(() => {
    const ids = ["beranda", "tentang", "fitur", "testimoni"];
    const onScroll = () => {
      const y = window.scrollY + 120;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/30 backdrop-blur">
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <img src="/sirsak.png" className="w-6 h-6" /> SIRSAK
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-white">
            {["beranda", "tentang", "fitur", "testimoni"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "font-semibold" : "opacity-80 hover:opacity-100"}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>
          <Button size="sm" className="bg-emerald-700" onClick={() => navigate("/login")}>
            Masuk
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold">
              Jadwal <span className="text-[#4880FF]">Bentrok?</span>
              <br />
              Reservasi Sekarang
            </h1>

            <p className="mt-4 opacity-90 max-w-[520px]">
              Solusi untuk anda yang sering menghadapi permasalahan ruangan yang
              tidak sesuai dengan jadwal yang direncanakan.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-emerald-700 hover:bg-emerald-800 px-8 py-6 text-lg rounded-xl shadow-lg"
                onClick={() => navigate("/login")}
              >
                Mulai Reservasi
              </Button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 p-6 text-center">
              <Stat icon={<Users className="mx-auto text-emerald-600" />} value="200+" label="Pengguna Aktif" />
              <Stat icon={<Building2 className="mx-auto text-emerald-600" />} value="40+" label="Ruangan Tersedia" />
              <Stat icon={<CalendarCheck className="mx-auto text-emerald-600" />} value="100+" label="Reservasi/Bulan" />
              <Stat icon={<Star className="mx-auto text-emerald-600" />} value="88%" label="Kepuasan" />
            </div>
          </div>
        </div>
      </section>
      <div className="h-32 md:h-24 bg-[#f4f5f6]" />

      {/* TENTANG */}
      <section id="tentang" className="py-24 bg-muted">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="ml-[110px]">
            <h2 className="text-3xl font-bold mb-4">Apa Itu <span className="text-[#4880FF]">SIRSAK</span>?</h2>
            <p className="mb-6 max-w-[600px]">
              <span className="font-bold">SIRSAK (Sistem Informasi Ruangan Sunan Kalijaga)</span> adalah platform digital yang dirancang khusus untuk mengatasi permasalahan pengelolaan ruangan di UIN Sunan Kalijaga.
            </p>
            <p className="mb-1 max-w-[600px]">Pengelolaan ruangan di kampus yang masih dilakukan secara manual sering menyebabkan berbagai masalah seperti:</p>
            <ul className="list-disc ml-5 text-black space-y-1">
              <li>Jadwal bentrok</li>
              <li>Ruangan tidak tersedia</li>
              <li>Perubahan mendadak</li>
            </ul>
            <p className="mt-6 max-w-[600px]"><span className="font-bold">SIRSAK</span> hadir sebagai solusi modern untuk mengoptimalkan penggunaan ruangan kampus.</p>
          </div>
          <img src="/classroom.png" className="w-full h-full" />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <img src="/dashboard.png"/>
          <div>
            <h2 className="text-3xl font-bold mb-6">Solusi untuk Tantangan Kampus Anda</h2>
            <Feature title="Pencarian Ruang Cerdas" desc="Temukan ruangan sesuai kebutuhan" />
            <Feature title="Reservasi Online 24/7" desc="Ajukan kapan saja" />
            <Feature title="Integrasi Kalender" desc="Sinkron dengan jadwal akademik" />
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section id="testimoni" className="py-24 bg-muted">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl mb-10 font-bold mb-4 max-w-[400px]">Bagaimana <span className="text-[#4880FF]">SIRSAK</span> membantu mereka?</h2>
            <p className="italic text-muted-foreground max-w-[500px]">
              “Sebagai mahasiswa prodi informatika, terkadang saya sering mengalami kendala perubahan jadwal ruangan matkul yang tiba-tiba berubah atau bentrok dengan kelas matkul lain. Tapi sejak pake SIRSAK, saya sekarang bisa mantau informasi terbaru terkait ruangan yang ingin digunakan untuk kegiatan belajar mengajar, jadi gabakal telat buat dapat info kelas.”
            </p>
            <Badge className="mt-4">Mahasiswa Informatika</Badge>
          </div>
          <img src="/user.png" className="rounded-2xl shadow-xl" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <img src="/sirsak.png" className="w-5 h-5" /> SIRSAK
            </div>
            <p>Solusi reservasi ruangan kampus modern.</p>
          </div>
          <FooterCol title="Tentang" items={["Beranda", "Fitur", "Testimoni"]} />
          <FooterCol title="Layanan" items={["Reservasi", "Kalender", "Pencarian"]} />
          <FooterCol title="Sumber Daya" items={["FAQ", "Kontak"]} />
        </div>
      </footer>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="space-y-2">
      <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        {icon}
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p className="font-semibold text-white mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i} className="hover:text-white cursor-pointer">{i}</li>
        ))}
      </ul>
    </div>
  );
}
