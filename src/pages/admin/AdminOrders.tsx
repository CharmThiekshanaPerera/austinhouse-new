import { useState } from "react";
import { 
  ShoppingBag, Search, Filter, Eye, Phone, MessageSquare, 
  CheckCircle2, Clock, XCircle, Trash2, MoreVertical, 
  MapPin, User, Mail, Calendar, Package, CreditCard
} from "lucide-react";
import { useData, Order } from "@/contexts/DataContext";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AdminOrders = () => {
  const { orders, updateOrder, deleteOrder } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredOrders = orders.filter(
    (o) =>
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.includes(searchQuery) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "Pending": return { icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
      case "Processing": return { icon: Package, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "Shipped": return { icon: Package, className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" };
      case "Delivered": return { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      case "Cancelled": return { icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" };
      default: return { icon: Clock, className: "" };
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Order["status"]) => {
    try {
      await updateOrder(id, { status: newStatus });
      toast({ title: "Status Updated", description: `Order ${id} is now ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        toast({ title: "Order Deleted" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete order", variant: "destructive" });
      }
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hello ${name}, this is Austin House regarding your order.`;
    window.open(`https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Product Orders</h1>
          <p className="text-muted-foreground font-body text-sm">Manage customer orders and shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border" 
            />
          </div>
          <Button variant="outline" className="font-body text-xs uppercase tracking-wider">
            <Filter size={14} className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/10">
                <TableHead className="font-body text-xs uppercase tracking-wider h-12">Order ID</TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wider h-12">Customer</TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wider h-12">Total</TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wider h-12">Date</TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wider h-12">Status</TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wider h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground font-body">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <TableRow key={order.id} className="border-border hover:bg-muted/5 transition-colors">
                      <TableCell className="font-body font-semibold">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-body font-bold text-foreground">{order.customer_name}</span>
                          <span className="text-[10px] text-muted-foreground">{order.customer_email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-display font-bold">LKR {order.total.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{format(new Date(order.createdAt), "MMM d, h:mm a")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-tighter", config.className)}>
                          <config.icon size={10} className="mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setSelectedOrder(order); setIsViewModalOpen(true); }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Processing")}>Status: Processing</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Shipped")}>Status: Shipped</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Delivered")}>Status: Delivered</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Cancelled")} className="text-destructive">Status: Cancelled</DropdownMenuItem>
                              <div className="h-px bg-border my-1" />
                              <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-destructive">Delete Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 bg-muted/10 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="font-display text-xl">Order Details</DialogTitle>
                    <DialogDescription className="font-body text-xs">#{selectedOrder.id}</DialogDescription>
                  </div>
                  <Badge className={cn("uppercase text-[10px]", getStatusConfig(selectedOrder.status).className)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6 space-y-6 border-r border-border">
                  <section className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Customer</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <User size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-body font-bold text-sm">{selectedOrder.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{selectedOrder.customer_email}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Contact & Address</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Phone size={14} className="text-gold" />
                        <span>{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <MapPin size={14} className="text-gold" />
                        <span>{selectedOrder.address}, {selectedOrder.city}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 h-8 text-[10px]"
                            onClick={() => openWhatsApp(selectedOrder.customer_phone, selectedOrder.customer_name)}
                        >
                            <MessageSquare size={12} className="mr-2 text-emerald-500" /> WhatsApp
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]" asChild>
                            <a href={`tel:${selectedOrder.customer_phone}`}>
                                <Phone size={12} className="mr-2 text-blue-500" /> Call
                            </a>
                        </Button>
                    </div>
                  </section>
                </div>

                <div className="p-6 bg-muted/5 flex flex-col h-full">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Items</h4>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[160px] pr-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-3 text-xs">
                        <span className="font-bold text-gold">{item.quantity}x</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold truncate">{item.name}</p>
                          <p className="text-muted-foreground">LKR {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex justify-between items-center bg-gold/5 p-3 rounded-lg border border-gold/10">
                      <span className="font-display font-bold text-foreground">Total Revenue</span>
                      <span className="font-display font-bold text-gold text-lg">LKR {selectedOrder.total.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 italic flex items-center justify-center gap-1">
                        <CreditCard size={10} /> Paid via {selectedOrder.payment_method}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
