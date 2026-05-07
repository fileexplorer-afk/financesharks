import { Button } from "@/components/ui/button";
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from "@/components/ui/card";
import {InputGroup,InputLabel,InputDescription,Input} from "@/components/ui/input"
import {Heading,Text,Muted,Metric,GradientText} from "@/components/ui/typography"
import {Badge} from "@/components/ui/badge"
import {Avatar} from "@/components/ui/avatar"

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

<InputGroup className="max-w-md">
  <InputLabel>
    Email Address
  </InputLabel>

  <Input
    type="email"
    placeholder="you@example.com"
  />

  <InputDescription>
    We’ll never share your email.
  </InputDescription>
</InputGroup>
<div className="space-y-4">
  <Heading level={1}>
    Welcome back
  </Heading>

  <Text>
    Track your financial growth with real-time insights.
  </Text>

  <Muted>
    Last updated 2 minutes ago
  </Muted>

  <Metric>
    ₹2,45,000
  </Metric>

  <GradientText>
    +18.2% this month
  </GradientText>
</div>
<div className="flex flex-wrap gap-3">

  <Badge>
    Default
  </Badge>

  <Badge variant="success">
    Completed
  </Badge>

  <Badge variant="danger">
    Failed
  </Badge>

  <Badge variant="warning">
    Pending
  </Badge>

  <Badge variant="info">
    Processing
  </Badge>

  <Badge variant="violet">
    Premium
  </Badge>

  <Badge variant="outline">
    Draft
  </Badge>

</div>
<div className="flex items-end gap-6">

  <Avatar
    fallback="RK"
    size="sm"
    status="online"
  />

  <Avatar
    fallback="JS"
    size="lg"
    status="idle"
  />

  <Avatar
    fallback="AI"
    size="xl"
    status="dnd"
  />

  <Avatar
    fallback="OP"
    size="lg"
    status="offline"
  />

</div>
    </div>
  );
}