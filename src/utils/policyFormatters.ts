export function formatPolicyTime(time: string | null | undefined): string {
  if (!time) return '';
  return time.substring(0, 5);
}

/** Show a single time when from/until match, otherwise a range. */
export function formatPolicyTimeRange(
  from: string | null | undefined,
  until: string | null | undefined,
  separator = ' — '
): string {
  const fromTime = formatPolicyTime(from);
  const untilTime = formatPolicyTime(until);

  if (!fromTime && !untilTime) return '';
  if (!fromTime) return untilTime;
  if (!untilTime) return fromTime;
  if (fromTime === untilTime) return fromTime;

  return `${fromTime}${separator}${untilTime}`;
}

type PolicyCheckInTimes = {
  check_in_from?: string | null;
  check_in_until?: string | null;
};

type PolicyCheckOutTimes = {
  check_out_from?: string | null;
  check_out_until?: string | null;
};

export function getCheckInTimeDisplay(
  policy: PolicyCheckInTimes | null | undefined,
  fallback = '',
  separator = ' — '
): string {
  if (!policy?.check_in_from && !policy?.check_in_until) return fallback;
  return formatPolicyTimeRange(policy.check_in_from, policy.check_in_until, separator) || fallback;
}

export function getCheckOutTimeDisplay(
  policy: PolicyCheckOutTimes | null | undefined,
  fallback = '',
  separator = ' — '
): string {
  if (!policy?.check_out_from && !policy?.check_out_until) return fallback;
  return formatPolicyTimeRange(policy.check_out_from, policy.check_out_until, separator) || fallback;
}

/** Single check-in time for compact displays (e.g. booking history cards). */
export function getCheckInSingleTimeDisplay(
  policy: PolicyCheckInTimes | null | undefined
): string {
  return formatPolicyTime(policy?.check_in_from) || formatPolicyTime(policy?.check_in_until);
}

/** Single check-out time for compact displays (e.g. booking history cards). */
export function getCheckOutSingleTimeDisplay(
  policy: PolicyCheckOutTimes | null | undefined
): string {
  return formatPolicyTime(policy?.check_out_until) || formatPolicyTime(policy?.check_out_from);
}
