import { z } from "zod";

export const ConfirmFormSchema = z.object({
  startDate: z
    .date({
      required_error: "Start date is required",
    })
    .refine((date) => date > new Date(), {
      message: "Start date must be in the future",
    }),
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
});
