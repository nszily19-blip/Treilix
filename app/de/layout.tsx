import LangSetter from "./LangSetter";

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LangSetter />
      {children}
    </>
  );
}
