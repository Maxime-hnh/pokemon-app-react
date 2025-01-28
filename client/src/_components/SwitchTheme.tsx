import { Switch, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export enum ColorScheme {
  DARK = "dark",
  LIGHT = "light"
}

const SwitchTheme = () => {

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [checked, setChecked] = useState(colorScheme === ColorScheme.DARK);

  useEffect(() => {

    const timeout = setTimeout(() => {
      setColorScheme(checked ? ColorScheme.DARK : ColorScheme.LIGHT);
    }, 150);

    return () => clearTimeout(timeout);
  }, [checked, setColorScheme]);

  return (

    <Switch
      size="md"
      color="dark.4"
      onChange={(e) => setChecked(e.currentTarget.checked)}
      checked={checked}
      onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
      offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
    />
  )
};

export default SwitchTheme;