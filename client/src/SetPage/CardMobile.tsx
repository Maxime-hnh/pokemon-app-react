import { CardBrief } from "../_interfaces/card.interface";
import { ActionIcon, Badge, Box, Button, Checkbox, Group, Image, Overlay, Paper, Skeleton, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import styles from './SetPage.module.scss';
import { IconArrowRightBar, IconCheck, IconCircle, IconPokeball, IconRefresh, IconSearch, IconSquareRotated, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { Set } from "../_interfaces/set.interface";
import { authStore } from "../_store/auth.store";
import { sanitizeKey } from "../_helpers/helpers";
import dayjs from "dayjs";

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
  console.log(card)
  return (
    <Box
      key={card.id}
      pos={"relative"}
      w={"100%"}
      pt={"160%"} //140% pour avoir la taille identique à la carte
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
          <Group align="flex-start" justify="center" wrap="nowrap" gap={0}>


            <Image
              className={styles.card_img}
              src={getImageUrl(card.image, "png", "low")}
              onLoad={() => handleImageLoad(card.id)}
              onClick={() =>
                searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
              }
              fit={"cover"}
              w={"65%"}
              opacity={myCards.includes(sanitizeKey(card.id)) ? 0.2 : 1}
            />

          </Group>

          {/*Title and prices*/}
          <Stack justify="flex-start" w={"100%"} gap={"xs"} h={"100%"}>
            <Stack gap={0}>
              <Title order={6} ta="start" className="titleFont">{card.name}</Title>
              <Text

                style={{ zIndex: 999 }}
                fz={8}
                fw={"bold"}
                c={"dimmed"}
              >
                {card.localId}/{set?.cardCount.official}
              </Text>
            </Stack>

            <Stack gap={0}>
              <Image
                src={"/assets/ebay-logo.svg"}
                w={35}
                alt="ebay"
                onClick={() =>
                  searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
                }
              />
              <Group wrap="nowrap" justify="center" gap={0}>

                <Badge size="xs" p={0} fw={"bold"} variant="transparent" color="blue" leftSection={<IconArrowRightBar color="#228be6" size={15} />}>{card.averagePrice}€</Badge>
                {card.averagePrice !== card.highestPrice
                  && <Badge size="xs" p={0} fw={"bold"} variant="transparent" color="red" leftSection={<IconTrendingUp color="red" size={15} />}>{card.highestPrice}€</Badge>
                }
                {card.averagePrice !== card.lowestPrice
                  && <Badge size="xs" p={0} fw={"bold"} variant="transparent" color="green" leftSection={<IconTrendingDown color="green" size={15} />}>{card.lowestPrice}€</Badge>
                }
              </Group>
            </Stack>
          </Stack>

          <Group gap={2} justify="flex-end" w={"100%"}>
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

          <Group gap={3}>
            <IconRefresh color="#828282" size={10} />
            <Text fz={8} c={"dimmed"}>{`Dernière mise à jour : ${dayjs(card.lastPriceUpdate).format('DD/MM/YYYY HH:mm')}`}</Text>
          </Group>
          {/* <Stack>
            <IconCircle />
            <IconSquareRotated />
            
          </Stack> */}
        </Stack>
      </Paper>
    </Box>
  )
}
export default CardMobile;