"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Username can only contain lowercase letters, numbers and hyphens"
    ),
  socialNetwork: z.string().min(1, "Please select a social network"),
  socialUsername: z
    .string()
    .min(1, "Please enter your social media username")
    .max(100, "Username is too long"),
});

type FormData = z.infer<typeof formSchema>;

export function MakeProfileForm() {
  const form = useForm<FormData>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      username: "",
      socialNetwork: "https://linkedin.com/in/",
      socialUsername: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      // Construct the full social media URL
      const fullSocialUrl = data.socialNetwork + data.socialUsername;

      // Store data in localStorage for now
      const userData = {
        username: data.username,
        socialUrl: fullSocialUrl,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      // Redirect to processing page
      window.location.href = `/profile/${data.username}`;
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const SOCIAL_NETWORKS = [
    {
      label: "LinkedIn",
      icon: "linkedin",
      value: "https://linkedin.com/in/",
    },
    {
      label: "GitHub",
      icon: "github",
      value: "https://github.com/",
    },
    {
      label: "Twitter",
      icon: "twitter",
      value: "https://twitter.com/",
    },
    {
      label: "Facebook",
      icon: "facebook",
      value: "https://facebook.com/",
    },
    {
      label: "Instagram",
      icon: "instagram",
      value: "https://instagram.com/",
    },
  ];

  return (
    <Card className="border-border/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Get Started</CardTitle>
        <CardDescription>
          Create your account and generate your professional portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        placeholder="Enter your username"
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>.lets0.com</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormDescription>
                    Only lowercase letters, numbers and hyphens
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="socialNetwork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Network</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_NETWORKS.map((network) => (
                            <SelectItem
                              key={network.value}
                              value={network.value}
                            >
                              {network.value}{" "}
                              <span className="text-muted-foreground">
                                {network.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Social Media Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your-username" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll use your public profile to generate your portfolio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Generating your profile..."
              ) : (
                <>
                  Create my portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
