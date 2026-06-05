import { z } from 'zod';

export type BookingGuestFormValues = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cancellationAccepted: boolean;
  tosAccepted: boolean;
};

export type BookingGuestFormField = keyof BookingGuestFormValues;

export function createBookingGuestFormSchema(messages: {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  cancellationRequired: string;
  tosRequired: string;
}) {
  return z.object({
    customerName: z.string().trim().min(1, messages.nameRequired),
    customerEmail: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    customerPhone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .refine((value) => value.replace(/\D/g, '').length >= 8, messages.phoneInvalid),
    cancellationAccepted: z.literal(true, messages.cancellationRequired),
    tosAccepted: z.literal(true, messages.tosRequired),
  });
}

export function parseBookingGuestFormErrors(
  error: z.ZodError<BookingGuestFormValues>
): Partial<Record<BookingGuestFormField, string>> {
  const fieldErrors: Partial<Record<BookingGuestFormField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === 'customerName' ||
      field === 'customerEmail' ||
      field === 'customerPhone' ||
      field === 'cancellationAccepted' ||
      field === 'tosAccepted'
    ) {
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
  }
  return fieldErrors;
}
