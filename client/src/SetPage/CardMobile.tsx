import { CardBrief } from "../_interfaces/card.interface";
import { ActionIcon, Box, Button, Checkbox, Group, Image, Overlay, Paper, Skeleton, Stack, Text, useMantineColorScheme } from "@mantine/core";
import styles from './SetPage.module.scss';
import { IconPokeball, IconSearch } from "@tabler/icons-react";
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { Set } from "../_interfaces/set.interface";
import { authStore } from "../_store/auth.store";
import { sanitizeKey } from "../_helpers/helpers";

interface CardMobileProps {
  set: Set;
  card: CardBrief;
  myCards: string[];
  handleFavoriteToggle: (setId: string, cardId: string) => void;
  handleImageLoad: (cardId: string) => void;
  loadedImages: Record<string, boolean>;
  isLoading: boolean;
}

const CardMobile = ({ set, card, myCards, handleFavoriteToggle, handleImageLoad, loadedImages, isLoading }: CardMobileProps) => {

  const { getImageUrl } = tcgdexService;
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
          <Group align="flex-start" justify="space-between" wrap="nowrap" gap={0}>

            <Image
              className={styles.card_img}
              src={getImageUrl(card.image, "png", "low")}
              onLoad={() => handleImageLoad(card.id)}
              onClick={() =>
                searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
              }
              fit={"cover"}
              w={"75%"}
            />

            {isLoading
              ? <Skeleton radius={"xl"} w={24} h={24} />
              : <Image
                style={{ zIndex: 999 }}
                w={24}
                h={24}
                src={myCards.includes(sanitizeKey(card.id))
                  ? "/assets/pokeball-red.svg"
                  : "/assets/pokeball-gray.svg"
                }
                onClick={() => handleFavoriteToggle(set.id, card.id)}
              />
            }
          </Group>
          <Stack justify="space-between" w={"100%"}>


            <Text
              fw={"bold"}
              style={{ zIndex: 999 }}
            >
              50.00 €
            </Text>
          </Stack>
          <Text
            style={{ zIndex: 999 }}
            fz={"xs"}
            pos={"absolute"}
            bottom={0}
            right={3}
          >
            {card.localId}/{set?.cardCount.official}
          </Text>
          {myCards.includes(sanitizeKey(card.id)) &&
            <Overlay color={colorScheme === "dark" ? "#000" : "#fff"} backgroundOpacity={0.35} blur={2} />
          }
        </Stack>
      </Paper>
    </Box>
  )
}
export default CardMobile;