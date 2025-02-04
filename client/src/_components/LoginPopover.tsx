import { ActionIcon, Button, PasswordInput, Popover, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail, IconPassword, IconPower, IconUser } from "@tabler/icons-react";
import { UserProps } from "../_interfaces/user.interface";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../_config/firebaseConfig";
import { authStore } from "../_store/auth.store";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { observer } from "mobx-react-lite";

const LoginPopover = observer(() => {

  const { setLoggedUser, loggedUser, clearToken } = authStore;
  const [opened, setOpened] = useState(false);

  const form = useForm<UserProps>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) =>
        value.trim().length === 0 ? "Veuillez renseigner un email" : null,
      password: (value: string) =>
        value.trim().length === 0 ? "Veuillez renseigner un mot de passe" : null
    },
  });

  const handleLogin = async (values: UserProps) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      if (userCredential) {
        setLoggedUser(userCredential.user);
        setOpened(!opened);
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        form.setFieldError("password", "Une erreur est survenue")
      } else {
        notifications.show({ message: error, color: 'red' })
      }
    };
  };

  const handleLogout = () => {
    clearToken();
    setOpened(!opened);
  }

  return (
    <>
      <Popover
        trapFocus
        withArrow
        width={300}
        position="bottom"
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <ActionIcon radius={"xl"} size={"lg"} variant="outline" onClick={() => setOpened((o) => !o)}>
            <IconUser />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          {!loggedUser
            ? <form
              onSubmit={form.onSubmit((values) => handleLogin(values))}
            >
              <Stack gap={"xs"}>
                <TextInput
                  data-autofocus
                  label="Email"
                  name="email"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                  withAsterisk
                  leftSection={<IconMail />}
                />

                <PasswordInput
                  label="Mot de passe"
                  name="password"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                  leftSection={<IconPassword />}
                />
                <Button type="submit">Connexion</Button>
              </Stack>
            </form>
            : <Button variant="subtle" w={"100%"} leftSection={<IconPower />} onClick={handleLogout}>Me déconnecter</Button>
          }
        </Popover.Dropdown>
      </Popover>
    </>
  )
});

export default LoginPopover;