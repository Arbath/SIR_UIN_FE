import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import universityHero from "@/assets/university-hero.jpg";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const sections = ["beranda", "tentang", "fitur", "testimoni"];

    const onScroll = () => {
      const scrollY = window.scrollY + 100;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const { offsetTop, offsetHeight } = el;

        if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "auto";
    }

    return () => {
      document.body.style.overflow = originalOverflow || "auto";
    };
  }, [showLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://sirsakapi.teknohole.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("role", data.user.role);
      navigate(`/${data.user.role}/dashboard`);
    } catch {
      alert("Login gagal. Periksa username atau password.");
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-background/10 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white">
            <div>
              <img
                src="/sirsak.png"
                alt="Sirsak"
                className="w-6 h-6 object-contain"
              />
            </div>
            SIRSAK
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            {["beranda", "tentang", "fitur", "testimoni"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`transition ${
                  activeSection === id
                    ? "font-medium text-white"
                    : "font-normal text-white/80 hover:text-white"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>
          <Button size="sm" className="bg-[#35775F]" onClick={() => setShowLogin(true)}>Masuk</Button>
        </div>
      </header>

      {/* LANDING SECTIONS */}
      <main
        className={`transition-all duration-700 ease-in-out overflow-hidden
        ${showLogin ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[5000px] opacity-100"}`}
      >

        {/* BERANDA / HERO */}
        <section
          id="beranda"
          className="relative min-h-screen flex items-center text-white"
          style={{
            backgroundImage: `url(${universityHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Jadwal Bentrok?
              Reservasi Sekarang
            </h1>
            <p className="max-w-2xl mx-auto opacity-90 mb-10">
              Solusi untuk anda yang sering menghadapi permasalahan ruangan yang tidak sesuai dengan jadwal yang direncanakan.
            </p>
            <Button size="lg" className="bg-[#35775F]" onClick={() => setShowLogin(true)}>
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="min-h-screen py-24 container mx-auto px-4" />

        {/* FITUR */}
        <section id="fitur" className="min-h-screen py-24 bg-muted" />

        {/* CARA KERJA */}
        <section id="testimoni" className="min-h-screen py-24 container mx-auto px-4" />
      </main>

      {/* LOGIN MODE */}
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700
        ${showLogin ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Card className="w-full max-w-md shadow-large">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Masuk ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="username" value={loginData.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" name="password" value={loginData.password} onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full">Masuk</Button>
            </form>
            <Button variant="ghost" className="w-full mt-4 flex gap-2" onClick={() => setShowLogin(false)}>
              <ArrowLeft className="h-4 w-4" /> Kembali ke Landing
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Landing;