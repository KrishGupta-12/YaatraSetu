
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getAllHotels, addHotel, updateHotel, deleteHotel } from "@/lib/firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const allAmenities = ["Pool", "Gym", "WiFi", "Spa", "Fine Dining", "Restaurant", "Beach Access", "Casino"];

const hotelSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
  image: z.string().url("Must be a valid image URL"),
  description: z.string().min(10, "Description is too short"),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
});

type HotelFormData = z.infer<typeof hotelSchema>;

type Hotel = HotelFormData & {
  id: string;
};

export default function HotelsAdminPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const hotelsData = await getAllHotels();
      setHotels(hotelsData as Hotel[]);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      toast({ variant: "destructive", title: "Failed to fetch hotels." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDialogOpen = (hotel: Hotel | null = null) => {
    setEditingHotel(hotel);
    if (hotel) {
      form.reset({
        ...hotel,
        amenities: hotel.amenities || []
      });
    } else {
      form.reset({
        name: "", city: "", price: 0, rating: 3, image: "", description: "", amenities: []
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setEditingHotel(null);
    form.reset();
    setIsDialogOpen(false);
  }

  const onSubmit = async (data: HotelFormData) => {
    setIsSubmitting(true);
    try {
      if (editingHotel) {
        await updateHotel(editingHotel.id, data);
        toast({ title: "Hotel updated successfully." });
      } else {
        await addHotel(data);
        toast({ title: "Hotel added successfully." });
      }
      fetchHotels();
      handleDialogClose();
    } catch (error) {
      console.error("Failed to save hotel:", error);
      toast({ variant: "destructive", title: "Failed to save hotel." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (hotelId: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await deleteHotel(hotelId);
      toast({ title: "Hotel deleted." });
      fetchHotels();
    } catch (error) {
      console.error("Failed to delete hotel:", error);
      toast({ variant: "destructive", title: "Failed to delete hotel." });
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Hotel Management</h1>
            <Button onClick={() => handleDialogOpen()}>
                <Plus className="mr-2 h-4 w-4" /> Add Hotel
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Hotels</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {hotels.map((hotel) => (
                        <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.city}</TableCell>
                        <TableCell>Rs. {hotel.price}</TableCell>
                        <TableCell>{hotel.rating} ★</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(hotel)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(hotel.id)}><Trash className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="city" render={({ field }) => (
                             <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price per night (Rs.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="rating" render={({ field }) => (
                            <FormItem><FormLabel>Rating (1-5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="image" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                                <FormLabel>Amenities</FormLabel>
                                <div className="grid grid-cols-3 gap-2">
                                    {allAmenities.map((item) => (
                                        <FormField
                                            key={item}
                                            control={form.control}
                                            name="amenities"
                                            render={({ field }) => (
                                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                            ? field.onChange([...(field.value || []), item])
                                                            : field.onChange(field.value?.filter((value) => value !== item))
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{item}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingHotel ? "Save Changes" : "Add Hotel"}
                        </Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    