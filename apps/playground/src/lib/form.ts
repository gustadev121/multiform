import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createMultiForm } from "multiform";

/**
 * Pre-bound MultiForm instance mapped to the project's shadcn/ui components.
 */
export const AppForm = createMultiForm({
  components: {
    input: Input,
    select: { Select, SelectContent, SelectItem, SelectTrigger, SelectValue },
    otp: { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator },
    textarea: Textarea,
    switch: Switch,
    checkbox: Checkbox,
    label: Label,
    button: Button,
  },
});
