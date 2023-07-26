export default function contains<T extends string>(
  array: ReadonlyArray<T>,
  value: T
): value is T {
  return array.some((item) => item === value);
}
