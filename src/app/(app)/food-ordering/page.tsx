import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FoodOrderingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Order Food on Train</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enter PNR or Train Number</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Food ordering interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
