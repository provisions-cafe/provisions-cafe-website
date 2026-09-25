import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { COLORS } from "../ui";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: COLORS.cream,
      }}
    >
      <LoginForm />
    </div>
  );
}
