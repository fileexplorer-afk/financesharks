import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  InputGroup,
  InputLabel,
  InputDescription,
  Input,
} from "@/components/ui/input";

import {
  Heading,
  Text,
  Muted,
  Metric,
  GradientText,
} from "@/components/ui/typography";

import { Badge } from "@/components/ui/badge";

import { Avatar } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";

export function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-[#09090B] p-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">

        {/* HERO */}
        <section className="space-y-3">
          <Heading level={1}>
            FinanceSharks Design System
          </Heading>

          <Text className="max-w-2xl">
            Cinematic fintech components engineered for
            high-end product experiences.
          </Text>
        </section>

        {/* BUTTONS */}
        <section className="space-y-8">
          <Heading level={3}>
            Buttons
          </Heading>

          <div className="flex flex-wrap gap-4">
            <Button>
              Launch Transfer
            </Button>

            <Button variant="glass">
              Open Workspace
            </Button>

            <Button variant="success">
              Payment Approved
            </Button>

            <Button variant="danger">
              Delete Account
            </Button>

            <Button variant="ghost">
              Ghost Action
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">
              Small
            </Button>

            <Button size="md">
              Medium
            </Button>

            <Button size="lg">
              Large
            </Button>

            <Button size="xl">
              Massive
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button loading>
              Processing Payment
            </Button>

            <Button
              variant="glass"
              loading
            >
              Connecting Bank
            </Button>

            <Button disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* CARD */}
        <section className="space-y-8">
          <Heading level={3}>
            Card
          </Heading>

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
        </section>

        {/* INPUT */}
        <section className="space-y-8">
          <Heading level={3}>
            Inputs
          </Heading>

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
        </section>

        {/* TYPOGRAPHY */}
        <section className="space-y-6">
          <Heading level={3}>
            Typography
          </Heading>

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
        </section>

        {/* BADGES */}
        <section className="space-y-8">
          <Heading level={3}>
            Badges
          </Heading>

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
        </section>

        {/* AVATARS */}
        <section className="space-y-8">
          <Heading level={3}>
            Avatars
          </Heading>

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
        </section>

        {/* SKELETON */}
        <section className="space-y-8">
          <Heading level={3}>
            Skeletons
          </Heading>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[140px]" />
              </div>
            </div>

            <Skeleton className="h-[180px] w-full rounded-3xl" />
          </div>
        </section>

      </div>
    </div>
  );
}