import { CardBrief } from "../_interfaces/card.interface";
import { ActionIcon, Box, Button, Checkbox, Group, Image, Paper, Skeleton, Stack, Text, useMantineColorScheme } from "@mantine/core";
import styles from './SetPage.module.scss';
import { IconSearch } from "@tabler/icons-react";
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { Set } from "../_interfaces/set.interface";
import { authStore } from "../_store/auth.store";

interface CardMobileProps {
  set: Set;
  card: CardBrief;
  favorites: string[];
  handleFavoriteToggle: (cardId: string, value: boolean) => void;
  handleImageLoad: (cardId: string) => void;
  loadedImages: Record<string, boolean>;
  isLoading: boolean;
}

const CardMobile = ({ set, card, favorites, handleFavoriteToggle, handleImageLoad, loadedImages, isLoading }: CardMobileProps) => {

  const { getImageUrl } = tcgdexService;
  const { loggedUser } = authStore;
  const { colorScheme } = useMantineColorScheme();
  const { searchOnEbay } = ebayService;

  return (
    <Box
      key={card.id}
      pos={"relative"}
      w={"100%"}
      pt={"140%"}
      style={{ overflow: "hidden" }}
    >
      {!loadedImages[card.id] && (
        <Skeleton
          w={"100%"}
          h={"100%"}
          pos={"absolute"}
          top={0}
          left={0}
        />
      )}
      <Paper
        pos={"absolute"}
        top={0}
        left={0}
        w={"100%"}
        h={"100%"}
        display={loadedImages[card.id] ? "block" : "none"}
        withBorder
        shadow="md"
        bg={colorScheme === "dark" ? "#101010" : "#fff"}
      >
        <Stack
          w={"100%"}
          h={"100%"}
          align="flex-start"
          justify="space-between"
          p={5}
          gap={0}
        >
          <Group align="flex-start" justify="space-between" wrap="nowrap">

            <Image
              className={styles.card_img}
              src={getImageUrl(card.image, "png", "low")}
              onLoad={() => handleImageLoad(card.id)}
              fit={"cover"}
              w={"75%"}
            />
            <Stack>
              {isLoading
                ? <Skeleton w={24} h={24} />
                : <Checkbox
                  disabled={!loggedUser}
                  size="md"
                  color="green"
                  checked={favorites.includes(card.id)}
                  onChange={(event) => handleFavoriteToggle(card.id, event.currentTarget.checked)}
                  style={{ cursor: "pointer" }}
                />
              }
              <ActionIcon
                w={24}
                maw={24}
                mah={24}
                h={24}
                color="yellow"
                onClick={() =>
                  searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
                }
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Stack>
          </Group>
          <Stack justify="space-between" w={"100%"}>


            <Text
              fw={"bold"}
            >
              50.00 €
            </Text>
          </Stack>
          <Text fz={"xs"} pos={"absolute"} bottom={0} right={0}>{card.localId}/{set?.cardCount.official}</Text>
        </Stack>
      </Paper>
    </Box>
  )
}
export default CardMobile;