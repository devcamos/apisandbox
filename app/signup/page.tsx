import { getGoogleClientId } from "@/lib/google-client-id"
import SignupForm from "./SignupForm"

export default function SignupPage() {
  const googleClientId = getGoogleClientId()
  return <SignupForm googleClientId={googleClientId} />
}
