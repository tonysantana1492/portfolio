"use client";

import { useEffect } from "react";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useQueryState } from "nuqs";
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
import { UsernameStatusIndicator } from "@/components/username-status-indicator";
import { useUsernameAvailability } from "@/hooks/use-username-availability";

// Form validation schema
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 50 characters"),
  socialNetwork: z.string().min(1, "Please select a social network"),
  socialUsername: z
    .string()
    .min(1, "Please enter your social media username")
    .max(20, "Username is too long"),
});

type FormData = z.infer<typeof formSchema>;

// Function to format username: lowercase, remove accents, replace spaces with hyphens
const formatUsername = (value: string): string => {
  return value
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents/diacritics
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-_.]/g, ""); // Allow letters, numbers, hyphens, underscores, and dots
};

export function MakeProfileForm() {
  // Use nuqs for URL state persistence
  const [username, setUsername] = useQueryState("username", {
    defaultValue: "",
    shallow: false,
  });
  const [socialUsername, setSocialUsername] = useQueryState("socialUsername", {
    defaultValue: "",
    shallow: false,
  });
  const [socialNetwork, setSocialNetwork] = useQueryState("socialNetwork", {
    defaultValue: "https://linkedin.com/in/",
    shallow: false,
  });

  const form = useForm<FormData>({
    resolver: standardSchemaResolver(formSchema),
    values: {
      username,
      socialNetwork,
      socialUsername,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Sync socialUsername to username automatically
  useEffect(() => {
    if (socialUsername) {
      const formattedUsername = formatUsername(socialUsername);
      setUsername(formattedUsername);
    }
  }, [socialUsername, setUsername]);

  // Watch the username field for real-time validation
  const { isChecking, isAvailable, error } = useUsernameAvailability(username);

  const onSubmit = async (data: FormData) => {
    try {
      // Check one more time before submission to ensure username is still available
      if (!isAvailable) {
        form.setError("username", {
          type: "manual",
          message: "Username is not available",
        });
        return;
      }

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

  // Function to get the icon and color based on availability status
  const getUsernameStatusIcon = () => {
    if (!username || username.length < 3) return null;

    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (error) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }

    if (isAvailable === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    if (isAvailable === false) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }

    return null;
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
                        value={username}
                        onChange={(e) => {
                          const formattedValue = formatUsername(e.target.value);
                          setUsername(formattedValue);
                          field.onChange(formattedValue);
                        }}
                        className="pr-32"
                      />
                      <InputGroupAddon align="inline-end">
                        <div className="flex items-center gap-2">
                          {getUsernameStatusIcon()}
                          <InputGroupText>.lets0.com</InputGroupText>
                        </div>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  {/* <FormDescription>
                    Only lowercase letters, numbers and hyphens
                  </FormDescription> */}
                  <UsernameStatusIndicator
                    isChecking={isChecking}
                    isAvailable={isAvailable}
                    error={error}
                    username={username}
                  />
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
                    <FormLabel>Your Social Media Username</FormLabel>
                    <FormControl>
                      <Select
                        value={socialNetwork}
                        onValueChange={(value) => {
                          setSocialNetwork(value);
                          field.onChange(value);
                        }}
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
                              <span className="text-muted-foreground">
                                {network.value}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      We'll use your public profile to generate your portfolio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="your-username"
                        value={socialUsername}
                        onChange={(e) => {
                          setSocialUsername(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                isSubmitting ||
                isChecking ||
                (username.length >= 3 && isAvailable === false) ||
                (username.length >= 3 && isAvailable === null && !isChecking)
              }
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
