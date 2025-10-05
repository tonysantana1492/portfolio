"use client";

import { useActionState, useState } from "react";

import { Smile } from "lucide-react";

import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/shared/emoji-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ROOT_DOMAIN } from "@/config/app.config";
import { createSubdomainAction } from "@/services/actions";

type CreateState = {
  error?: string;
  success?: boolean;
  subdomain?: string;
  icon?: string;
};

function SubdomainInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subdomain">Subdomain</Label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-subdomain"
            defaultValue={defaultValue}
            className="w-full rounded-r-none focus:z-10"
            required
          />
        </div>
        <span className="flex min-h-[36px] items-center rounded-r-md border border-input border-l-0 bg-gray-100 px-3 text-gray-500">
          .{ROOT_DOMAIN}
        </span>
      </div>
    </div>
  );
}

function IconPicker({
  icon,
  setIcon,
  defaultValue,
}: {
  icon: string;
  setIcon: (icon: string) => void;
  defaultValue?: string;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    setIcon(emoji);
    setIsPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="icon">Icon</Label>
      <div className="flex flex-col gap-2">
        <input type="hidden" name="icon" value={icon} required />
        <div className="flex items-center gap-2">
          <Card className="flex flex-1 flex-row items-center justify-between rounded-md border border-input p-2">
            <div className="flex min-h-[40px] min-w-[40px] select-none items-center pl-[14px]">
              {icon ? (
                <span className="text-3xl">{icon}</span>
              ) : (
                <span className="font-normal text-gray-400 text-sm">
                  No icon selected
                </span>
              )}
            </div>
            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto rounded-sm"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                  <Smile className="mr-2 h-4 w-4" />
                  Select Emoji
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[256px] p-0"
                align="end"
                sideOffset={5}
              >
                <EmojiPicker
                  className="h-[300px] w-[256px]"
                  defaultValue={defaultValue}
                  onEmojiSelect={handleEmojiSelect}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          </Card>
        </div>
        <p className="text-gray-500 text-xs">
          Select an emoji to represent your subdomain
        </p>
      </div>
    </div>
  );
}

export function SubdomainForm() {
  const [icon, setIcon] = useState("");

  const [state, action, isPending] = useActionState<CreateState, FormData>(
    createSubdomainAction,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      <SubdomainInput defaultValue={state?.subdomain} />

      <IconPicker icon={icon} setIcon={setIcon} defaultValue={state?.icon} />

      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isPending || !icon}>
        {isPending ? "Creating..." : "Create Subdomain"}
      </Button>
    </form>
  );
}
