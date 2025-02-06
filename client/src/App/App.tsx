import {
  AppShell,
  Burger,
  Button,
  createTheme,
  Group,
  Image,
  Loader,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import dayjs from 'dayjs';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import "@mantine/notifications/styles.css";
import "../global.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useWindowSize from '../_components/utils/useWindowSize';
import { Suspense, useEffect, useState } from 'react';
import { MOBILE_SIZE } from '../_helpers/constants';
import AppContext from './AppContext';
import { Notifications } from '@mantine/notifications';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import HomePage from '../HomePage/HomePage';
import SwitchTheme from '../_components/SwitchTheme';
import SetPage from '../SetPage/SetPage';
import SignupPage from '../SignupPage/SignupPage';
import { ModalsProvider } from '@mantine/modals';
import LoginPopover from '../_components/LoginPopover';

const App = () => {

  dayjs.extend(customParseFormat);

  const themeMantine: MantineThemeOverride = createTheme({
    autoContrast: true,
    components: {
      // Paper: {
      //   styles: (theme: any) => ({
      //     root: {
      //       backgroundColor: theme === 'dark'
      //         ? "#101010"
      //         : "red"
      //     }
      //   })
      // }
    }

  });

  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_SIZE;
    setIsMobile(isMobile);
    const vh = window.innerHeight * 0.01;
    if (isMobile) document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [width]);


  return (
    <MantineProvider theme={themeMantine} defaultColorScheme="light">
      <Notifications autoClose={4000} zIndex={1000000} />
      <ModalsProvider />
      <AppContext.Provider value={{
        isMobile,
      }}>

        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
          padding={{ base: "xs", md: "md" }}
        >

          <AppShell.Header>
            <Group justify='space-between' h="100%" px="md">
              <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Image
                  w={120}
                  src={"/assets/pokeprice_logo.png"}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                />
              </Group>
              <Group>
                <SwitchTheme />
                <LoginPopover />
              </Group>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar py="md" px={4}>
            {/* <Button>ok</Button> */}
          </AppShell.Navbar>

          <AppShell.Main>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/set/:setId" element={<SetPage />} />
                <Route path="/login" element={<SignupPage />} />
              </Routes>
            </Suspense>
          </AppShell.Main>

        </AppShell>

      </AppContext.Provider>
    </MantineProvider>
  );
}

export default App;
