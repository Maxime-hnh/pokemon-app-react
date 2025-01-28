import { Group, Image, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { GoogleAuthProvider } from "firebase/auth";
import { authFirebaseService } from "../_services/authFirebase.service";

interface SignInWithProvidersProps {
  text: string;
  closeModal: () => void;
}

const SignInWithProviders = observer(({ text, closeModal }: SignInWithProvidersProps) => {

  const { handleSignInWithProvider } = authFirebaseService

  return (
    <Group p="center" mt="md" mb="xs">
      <Text>{text}</Text>
      <Image
        style={{ cursor: "pointer" }}
        h={40}
        onClick={() => handleSignInWithProvider(new GoogleAuthProvider(), 'Google', closeModal)}
        src={"/img/logo-google.svg"} />
    </Group>
  );
})

export default SignInWithProviders;