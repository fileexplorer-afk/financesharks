import { Button } from "@/components/ui/button";
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from "@/components/ui/card";

export function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-[#09090B] p-10 text-white">
      <div className="space-y-8">

        <div className="flex gap-4 flex-wrap">
          <Button>Primary</Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>

          <Button variant="danger">
            Danger
          </Button>

          <Button variant="success">
            Success
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Button size="sm">
            Small
          </Button>

          <Button size="md">
            Medium
          </Button>

          <Button size="lg">
            Large
          </Button>
        </div>

        <div className="flex gap-4">
          <Button loading>
            Saving
          </Button>

          <Button disabled>
            Disabled
          </Button>
        </div>

      </div>
      <Card className="w-[420px]">
  <CardHeader>
    <div>
      <CardDescription>
        Total Balance
      </CardDescription>

      <CardTitle>
        ₹2,45,000
      </CardTitle>
    </div>
  </CardHeader>

  <CardContent>
    <p className="text-sm text-zinc-400">
      +12.5% from last month
    </p>
  </CardContent>
</Card>
    </div>
  );
}