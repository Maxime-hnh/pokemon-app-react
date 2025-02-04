import { Box, Button, Container, Group, Paper, PasswordInput, Popover, Progress, rem, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { UserSignupPros } from "../_interfaces/user.interface"
import { IconCheck, IconMail, IconSword, IconSwords, IconX } from "@tabler/icons-react"
import { useState } from "react"
import { authFirebaseService } from "../_services/authFirebase.service"
import { authStore } from "../_store/auth.store"
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { auth } from "../_config/firebaseConfig"
import { observer } from "mobx-react-lite"
import { notifications } from "@mantine/notifications"

const SignupPage = observer(() => {


  const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const { handleSignupWithEmailAndPassword, handleSignInWithEmailAndPassword } = authFirebaseService;
  const { setLoggedUser } = authStore;

  const form = useForm<UserSignupPros>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validate: {
      email: (value: string) =>
        value.trim().length === 0 ? "Veuillez renseigner un email" : null,
      password: (value: string) => {
        if (!value) {
          return "Veuillez renseigner un mot de passe";
        }
        if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)
        ) {
          return "Votre mot de passe doit contenir 8 caractères et au moins une majuscule, une minuscule et un nombre";
        }
        return null;
      },
      confirmPassword: (value: string, values: { password: string }) => {
        if (!value) {
          return "Confirmation requise";
        }
        if (value !== values.password) {
          return "La confirmation n'est pas identique au mot de passe";
        }
        return null;
      },
    },
  })

  const handleSubmit = async (values: UserSignupPros) => {
    try {
      let userCredential: UserCredential | null = null;
      try {
        // Tentative de connexion
        userCredential = await signInWithEmailAndPassword(auth, values.email, values.password!);
      } catch (error: any) {
        // Si l'utilisateur n'existe pas, procéder à l'inscription
        if (error.code === 'auth/user-not-found') {
          userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password!);
          console.log("Inscription réussie");
        } else {
          throw error;
        }
      }
      if (userCredential) {
        setLoggedUser(userCredential.user);
      }
    } catch (error: any) {
      notifications.show({ message: error, color: "red" })
    }
  };

  const requirements = [
    { re: /[0-9]/, label: 'Votre mot de passe doit contenir au moins un nombre' },
    { re: /[a-z]/, label: 'Votre mot de passe doit contenir au moins une minuscule' },
    { re: /[A-Z]/, label: 'Votre mot de passe doit contenir au moins une majuscule' },
  ];

  function getStrength(password: string) {
    let multiplier = password.length > 7 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }


  function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text
        c={meets ? 'teal' : 'red'}
        style={{ display: 'flex', alignItems: 'center' }}
        mt={7}
        size="sm"
      >
        {meets ? (
          <IconCheck style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <IconX style={{ width: rem(14), height: rem(14) }} />
        )}{' '}
        <Box ml={10}>{label}</Box>
      </Text>

    );
  }

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));
  const strength = getStrength(password);
  const color = strength && strength === 100 ? 'teal' : strength && strength > 50 ? 'yellow' : 'red';

  return (
    <Container>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <Paper withBorder p={"md"}>
          <Title ta="center" className={"titleFont"} mb={30}>Inscription</Title>
          <TextInput
            data-autofocus
            label="Email"
            name="email"
            placeholder="jean.dupont@mail.fr"
            key={form.key('email')}
            {...form.getInputProps('email')}
            withAsterisk
            leftSection={<IconMail />}
          />
          <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
            <Popover.Target>
              <div
                onFocusCapture={() => setPopoverOpened(true)}
                onBlurCapture={() => setPopoverOpened(false)}
              >
                <PasswordInput
                  withAsterisk
                  label="Nouveau mot de passe"
                  name="password"
                  value={form.values.password}
                  error={form.errors.password}
                  onChange={(e) => {
                    form.setFieldValue("password", e.currentTarget.value)
                    setPassword(e.currentTarget.value)
                  }}
                  leftSection={<IconSword />}
                />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              <PasswordRequirement label="Votre mot de passe doit contenir au moins 8 caractères"
                meets={form.values.password.length > 7} />
              {checks}
            </Popover.Dropdown>
          </Popover>

          <PasswordInput
            label="Confirmer le mot de passe"
            name="confirmPassword"
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
            withAsterisk
            leftSection={<IconSwords />}
          />
          <Group justify="center">
            <Button mt={"xl"} type="submit">Inscription / Connexion</Button>
          </Group>
        </Paper>
      </form>
    </Container>
  )
})

export default SignupPage