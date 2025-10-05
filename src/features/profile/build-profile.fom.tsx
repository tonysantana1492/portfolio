"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  SOCIAL_NETWORKS,
  SocialNetworkSelector,
} from "@/features/profile/social-network-selector";
import { UsernameStatusIndicator } from "@/features/profile/username-status-indicator";
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

export function BuildProfileForm() {
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
    setValue,
  } = form;

  // Sync socialUsername to username automatically
  // useEffect(() => {
  //   if (socialUsername) {
  //     const formattedUsername = formatUsername(socialUsername);
  //     setUsername(formattedUsername);
  //   }
  // }, [socialUsername, setUsername]);

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

  const selectedNetwork = SOCIAL_NETWORKS.find((network) =>
    socialNetwork?.includes(network.baseUrl)
  );

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
            {/* social network selector */}
            <SocialNetworkSelector
              socialNetwork={socialNetwork}
              onNetworkChange={(networkId) => {
                setSocialNetwork(networkId);
                setValue("socialNetwork", networkId);
              }}
            />
            {/* social username input */}
            {selectedNetwork && (
              <FormField
                control={form.control}
                name="socialUsername"
                render={() => (
                  <FormItem>
                    <FormLabel>Social Network</FormLabel>
                    <FormControl>
                      <InputGroup className="w-full">
                        <InputGroupInput
                          placeholder={selectedNetwork.placeholder}
                          value={socialUsername}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setSocialUsername(newValue);
                            setValue("socialUsername", newValue);
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            setSocialUsername(target.value);
                            setValue("socialUsername", target.value);
                          }}
                          className="text-sm"
                        />
                        <InputGroupAddon align="inline-start">
                          <div className="flex items-center gap-1.5">
                            <selectedNetwork.icon className="h-3.5 w-3.5" />
                            <InputGroupText className="text-muted-foreground text-xs">
                              {selectedNetwork.baseUrl.replace("https://", "")}
                            </InputGroupText>
                          </div>
                        </InputGroupAddon>

                        {socialUsername && (
                          <InputGroupAddon align="inline-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() =>
                                window.open(
                                  selectedNetwork.baseUrl + socialUsername,
                                  "_blank"
                                )
                              }
                              title="Create Profile"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* username input */}
            <FormField
              control={form.control}
              name="username"
              render={({ fieldState }) => (
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
                          setValue("username", formattedValue);
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
                  <UsernameStatusIndicator
                    isChecking={isChecking}
                    isAvailable={isAvailable}
                    error={error}
                    username={username}
                    formError={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />

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
