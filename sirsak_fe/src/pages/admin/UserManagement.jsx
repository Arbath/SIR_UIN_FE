import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  MoreHorizontal
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosInstance";

const UserManagement = () => {
  const { toast } = useToast();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password1: "",
    password2: "",
    kontak: "",
    fakultas: "",
    prodi: ""
  });

  useEffect(() => {
    const res = api.get("/profile/me");
    console.log(res);
  }, []);

  const handleAddUser = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.password1 ||
      !newUser.password2 ||
      !newUser.kontak
    ) {
      toast({
        title: "Mohon lengkapi field yang wajib diisi",
        description: "Username, email, dan password wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        password1: newUser.password1,
        password2: newUser.password2,
        kontak: newUser.kontak,
        fakultas: newUser.fakultas,
        prodi: newUser.prodi
      };

      await api.post("/register", payload);

      toast({
        title: "Pengguna berhasil ditambahkan",
        description: `${newUser.username} berhasil dibuat`,
        variant: "success",
      });

      setNewUser({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password1: "",
        password2: "",
        kontak: "",
        fakultas: "",
        prodi: ""
      });

      setIsAddUserOpen(false);

    } catch (err) {
      console.error("Gagal menambahkan user:", err);

      toast({
        title: "Gagal menambahkan pengguna",
        description:
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.username?.[0] ||
          "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Pengguna</h1>
          <p className="text-muted-foreground mt-1">Kelola data mahasiswa dan dosen</p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi pengguna baru yang akan ditambahkan
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* NAMA LENGKAP */}
              <div className="space-y-2">
                <Label>Nama Lengkap *</Label>
                <Input
                  placeholder="Masukkan nama lengkap"
                  onBlur={(e) => {
                    const parts = e.target.value.trim().split(/\s+/);

                    const first_name =
                      parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "";

                    const last_name =
                      parts.length > 1 ? parts[parts.length - 1] : "";

                    setNewUser(prev => ({
                      ...prev,
                      first_name,
                      last_name,
                    }));
                  }}
                />
              </div>

              {/* EMAIL & ROLE */}
              <div className="flex justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={newUser.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      const username = email.includes("@")
                        ? email.split("@")[0]
                        : "";

                      setNewUser(prev => ({
                        ...prev,
                        email,
                        username,
                      }));
                    }}
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <Label>Kontak *</Label>
                  <Input
                    type="number"
                    placeholder="08XXXXXXXXXX"
                    value={newUser.kontak}
                    onChange={(e) =>
                      setNewUser(prev => ({ ...prev, kontak: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <Label>Fakultas (Opsional)</Label>
                  <Input
                    placeholder="Masukkan nama fakultas"
                    value={newUser.fakultas}
                    onChange={(e) =>
                      setNewUser(prev => ({ ...prev, fakultas: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <Label>Prodi (Opsional)</Label>
                  <Input
                    placeholder="Masukkan nama prodi`"
                    value={newUser.prodi}
                    onChange={(e) =>
                      setNewUser(prev => ({ ...prev, prodi: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={newUser.password1}
                    onChange={(e) =>
                      setNewUser(prev => ({ ...prev, password1: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <Label>Konfirmasi Password *</Label>
                  <Input
                    type="password"
                    placeholder="Ulangi password"
                    value={newUser.password2}
                    onChange={(e) =>
                      setNewUser(prev => ({ ...prev, password2: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleAddUser}>
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-soft hover:shadow-medium transition-all hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pengguna</p>
                <p className="text-3xl font-bold text-primary">220</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User</p>
                <p className="text-3xl font-bold text-blue-500">200</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Staf</p>
                <p className="text-3xl font-bold text-green-500">15</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pengguna Aktif</p>
                <p className="text-3xl font-bold text-success">4</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Cari Pengguna</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nama atau email..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-filter">Filter Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Semua role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Role</SelectItem>
                  <SelectItem value="student">User</SelectItem>
                  <SelectItem value="lecturer">Staf</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Daftar Pengguna
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">ID/NIM</th>
                  <th className="text-left py-3 px-4">Departemen</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-center py-3 px-4">Aksi</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">API Masih Dalam Pengembangan</h3>
            <p className="text-muted-foreground">
              Bagi Admin Bisa Kunjungi https://sirsakapi.teknohole.com/admin/
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;


