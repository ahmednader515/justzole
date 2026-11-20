export function AccentText({ text }: { text: string }) {
  return text.endsWith(".") ? (
    <>
      {text.slice(0, -1)}
      <span>.</span>
    </>
  ) : (
    <>{text}</>
  );
}
