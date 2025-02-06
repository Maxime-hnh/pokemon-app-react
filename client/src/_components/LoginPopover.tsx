import { ActionIcon, Button, Popover } from "@mantine/core";
import { IconPower, IconUser } from "@tabler/icons-react";
import { authStore } from "../_store/auth.store";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const LoginPopover = observer(() => {

  const { loggedUser, clearToken } = authStore;
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
    clearToken();
    setOpened(!opened);
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
    setOpened(!opened)
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
            ? <Button
              color="green"
              type="button"
              variant="light"
              w={"100%"}
              onClick={handleLogin}
            >
              Connexion
            </Button>
            : <Button
              color="red"
              type="button"
              variant="light"
              w={"100%"}
              leftSection={<IconPower />}
              onClick={handleLogout}
            >
              Me déconnecter
            </Button>
          }
        </Popover.Dropdown>
      </Popover>
    </>
  )
});

export default LoginPopover;