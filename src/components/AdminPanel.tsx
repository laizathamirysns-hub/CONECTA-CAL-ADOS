/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package, DollarSign, BarChart3, Users, Briefcase, ChevronRight, Search } from 'lucide-react';
import { productService } from '../services/productService';
import { jobService } from '../services/jobService';
import { orderService } from '../services/orderService';
import { Product, Job, JobApplication, Order, UserProfile } from '../types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { UserDashboard } from './UserDashboard';

export function AdminPanel() {
  const { user, isAdmin, isManufacturer } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    let unsubProducts: () => void;
    if (isAdmin) {
      unsubProducts = productService.subscribeToProducts(setProducts);
    } else if (isManufacturer) {
      unsubProducts = productService.subscribeToManufacturerProducts(user.uid, setProducts);
    } else {
      unsubProducts = () => {};
    }

    const unsubJobs = jobService.subscribeToJobs(setJobs);
    const unsubOrders = isAdmin 
      ? orderService.subscribeToAllOrders(setOrders)
      : orderService.subscribeToUserOrders(user.uid, setOrders);
    
    let unsubUsers = () => {};
    if (isAdmin) {
      unsubUsers = userService.subscribeToUsers(setUsers);
    }
    
    return () => {
      unsubProducts();
      unsubJobs();
      unsubOrders();
      unsubUsers();
    };
  }, [user, isAdmin, isManufacturer]);

  const handleUpdateRole = async (uid: string, role: UserProfile['role']) => {
    if (confirm(`Alterar cargo do usuário para ${role}?`)) {
      await userService.updateUserRole(uid, role);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await productService.deleteProduct(id);
    }
  };

  const totalStockValue = products.reduce((acc, p) => {
    const stock = p.sizes.reduce((sAcc, s) => sAcc + s.quantity, 0);
    return acc + (stock * p.wholesalePrice);
  }, 0);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.4em] text-brand-gold uppercase">
              {isAdmin ? 'Admin Control' : 'Manufacturer Control'}
            </span>
            <h1 className="text-5xl font-bold tracking-tighter uppercase">Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger
                render={
                  <Button 
                    onClick={() => {
                      setEditingProduct(null);
                      setIsProductDialogOpen(true);
                    }}
                    className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none px-8 font-bold uppercase tracking-widest text-xs h-12"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                  </Button>
                }
              />
              <DialogContent className="max-w-4xl bg-brand-dark border-white/10 p-0">
                <ProductForm 
                  initialData={editingProduct || undefined}
                  onSuccess={() => setIsProductDialogOpen(false)}
                  onCancel={() => setIsProductDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue={isManufacturer ? "overview" : "personal"} className="space-y-12">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-none h-14">
            {isManufacturer && <TabsTrigger value="overview" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Visão Geral</TabsTrigger>}
            <TabsTrigger value="personal" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Minha Área</TabsTrigger>
            {isManufacturer && <TabsTrigger value="products" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Produtos</TabsTrigger>}
            <TabsTrigger value="orders" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Pedidos</TabsTrigger>
            {isManufacturer && <TabsTrigger value="jobs" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Vagas & Candidatos</TabsTrigger>}
            {isAdmin && <TabsTrigger value="users" className="rounded-none px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-brand-gold data-[state=active]:text-brand-dark">Usuários</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Receita Total', value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: DollarSign, color: 'text-green-500' },
                { label: 'Pedidos', value: orders.length, icon: Package, color: 'text-blue-500' },
                { label: 'Produtos', value: products.length, icon: BarChart3, color: 'text-brand-gold' },
                { label: 'Candidatos', value: '12', icon: Users, color: 'text-purple-500' },
              ].map((stat, i) => (
                <Card key={i} className="bg-brand-graphite border-white/5 rounded-none">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="bg-brand-graphite border-white/5 rounded-none">
                <CardHeader className="border-b border-white/5 p-8">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                    Pedidos Recentes
                    <Button variant="link" className="text-brand-gold p-0 h-auto text-[10px] uppercase tracking-widest">Ver Todos</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider">{order.customerInfo.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs font-bold text-brand-gold">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          <Badge className="bg-white/5 text-[8px] font-bold uppercase tracking-widest rounded-none border-white/10">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-graphite border-white/5 rounded-none">
                <CardHeader className="border-b border-white/5 p-8">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                    Candidaturas Recentes
                    <Button variant="link" className="text-brand-gold p-0 h-auto text-[10px] uppercase tracking-widest">Ver Todas</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col items-center justify-center py-20 text-white/20">
                    <Users className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma candidatura recente</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-brand-graphite border-white/5 rounded-none">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <th className="p-8">Produto</th>
                        {isAdmin && <th className="p-8">Vendedor</th>}
                        <th className="p-8">Categoria</th>
                        <th className="p-8">Preço (V/A)</th>
                        <th className="p-8">Estoque</th>
                        <th className="p-8 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <img src={product.images[0]} alt="" className="h-12 w-12 object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                              <span className="text-xs font-bold uppercase tracking-wider">{product.name}</span>
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="p-8">
                              <span className="text-[10px] text-white/40 font-mono">{product.manufacturerId.slice(-6)}</span>
                            </td>
                          )}
                          <td className="p-8">
                            <Badge variant="outline" className="border-white/10 text-[9px] font-bold uppercase tracking-widest rounded-none">{product.category}</Badge>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">R$ {product.retailPrice.toFixed(2)}</span>
                              <span className="text-[10px] text-brand-gold/60 font-bold">R$ {product.wholesalePrice.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="p-8">
                            <span className="text-xs font-bold">{product.sizes.reduce((acc, s) => acc + s.quantity, 0)} pares</span>
                          </td>
                          <td className="p-8 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsProductDialogOpen(true);
                                }}
                                className="h-8 w-8 text-white/40 hover:text-brand-gold hover:bg-white/5"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-white/5"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-brand-graphite border-white/5 rounded-none">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <th className="p-8">Pedido</th>
                        <th className="p-8">Cliente</th>
                        <th className="p-8">Data</th>
                        <th className="p-8">Total</th>
                        <th className="p-8">Status</th>
                        <th className="p-8 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-8 text-xs font-bold uppercase tracking-widest">#{order.id.slice(-6)}</td>
                          <td className="p-8 text-xs font-bold">{order.customerInfo.name}</td>
                          <td className="p-8 text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-8 text-xs font-bold text-brand-gold">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="p-8">
                            <Badge className="bg-white/5 text-[8px] font-bold uppercase tracking-widest rounded-none border-white/10">{order.status}</Badge>
                          </td>
                          <td className="p-8 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-brand-gold hover:bg-white/5">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal">
            <UserDashboard />
          </TabsContent>

          <TabsContent value="jobs">
            {/* ... jobs content ... */}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <Card className="bg-brand-graphite border-white/5 rounded-none">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <th className="p-8">Usuário</th>
                          <th className="p-8">E-mail</th>
                          <th className="p-8">Cargo Atual</th>
                          <th className="p-8 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                          <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                            <td className="p-8 text-xs font-bold">{u.displayName}</td>
                            <td className="p-8 text-xs text-white/40">{u.email}</td>
                            <td className="p-8">
                              <Badge className="bg-white/5 text-[8px] font-bold uppercase tracking-widest rounded-none border-white/10">{u.role}</Badge>
                            </td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUpdateRole(u.uid, u.role === 'manufacturer' ? 'customer' : 'manufacturer')}
                                  className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:bg-white/5"
                                >
                                  {u.role === 'manufacturer' ? 'Remover Vendedor' : 'Tornar Vendedor'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
