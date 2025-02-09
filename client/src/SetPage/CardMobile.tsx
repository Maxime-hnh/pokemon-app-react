import { CardBrief } from "../_interfaces/card.interface";
import { Badge, Box, Group, Image, Loader, Paper, Skeleton, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import styles from './SetPage.module.scss';
import { IconArrowRightBar, IconExternalLink, IconRefresh, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { Set } from "../_interfaces/set.interface";
import { sanitizeKey } from "../_helpers/helpers";
import dayjs from "dayjs";
import { cardService } from "../_services/card.service";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface CardMobileProps {
  set: Set;
  data: CardBrief;
  myCards: string[];
  handleFavoriteToggle: (setId: string, cardId: string) => void;
  handleImageLoad: (cardId: string) => void;
  loadedImages: Record<string, boolean>;
  isLoading: boolean;
}

const CardMobile = ({ set, data, myCards, handleFavoriteToggle, handleImageLoad, loadedImages, isLoading }: CardMobileProps) => {

  const [card, setCard] = useState<CardBrief>(data);
  const { getImageUrl } = tcgdexService;
  const { colorScheme } = useMantineColorScheme();
  const { searchOnEbay } = ebayService;
  const { updateEbayPrices } = cardService;
  const [priceIsLoading, setPriceIsLoading] = useState<boolean>(false);

  const updatePrices = async (serieId: string, setId: string, cardId: string) => {
    try {
      setPriceIsLoading(true);
      const updatedCard = await updateEbayPrices(serieId, setId, cardId)
      if (updatedCard) {
        setCard(updatedCard)
        notifications.show({ message: `Les prix de la carte ${card.name} ont été mis à jour`, color: "green" })
      }
    } catch (error) {
      notifications.show({ message: "Une erreur est survenue pendant la MAJ du prix", color: "red" })
    } finally {
      setPriceIsLoading(false);
    }
  }

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
          <Group align="flex-start" justify="center" wrap="nowrap" gap={0} pos={"relative"}>


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

              <Stack justify="center" gap={0}>
                <Badge radius={0} size="sm" p={0} fw={"bold"} variant="transparent" color="blue" leftSection={<IconArrowRightBar color="#228be6" size={15} />}>
                  {priceIsLoading
                    ? <Loader color="blue" size="xs" type="dots" />
                    : `${card.averagePrice} €`
                  }
                </Badge>

                {card.averagePrice !== card.lowestPrice
                  &&
                  <Badge radius={0} size="sm" p={0} fw={"bold"} variant="transparent" color="green" leftSection={<IconTrendingDown color="green" size={15} />}>
                    {priceIsLoading
                      ? <Loader color="green" size="xs" type="dots" />
                      : `${card.lowestPrice} €`
                    }
                  </Badge>
                }

                {card.averagePrice !== card.highestPrice
                  && <Badge radius={0} size="sm" p={0} fw={"bold"} variant="transparent" color="red" leftSection={<IconTrendingUp color="red" size={15} />}>
                    {priceIsLoading
                      ? <Loader color="red" size="xs" type="dots" />
                      : `${card.highestPrice} €`
                    }
                  </Badge>
                }

              </Stack>
            </Stack>
          </Stack>

          <Group pos={"absolute"} right={4}>
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

          <Group
            gap={3}
            wrap="nowrap"
            align="center"
            pos={"absolute"}
            bottom={1}
            left={5}
            onClick={() => updatePrices(set.serie.id, set.id, card.id)}
          >
            <IconRefresh
              color="#828282"
              size={10}
              style={{
                transition: "transform 0.3s ease-in-out",
                transform: priceIsLoading ? "rotate(360deg)" : "rotate(0deg)",
                animation: priceIsLoading ? "spin 1s linear infinite" : "none",
              }}
            />
            <Text fz={8} c={"dimmed"}>Dernière MAJ :</Text>
            {priceIsLoading
              ? <Loader color="blue" size="xs" type="dots" />
              : <Text fz={8} c={"dimmed"}>{`${dayjs(card.lastPriceUpdate).format('DD/MM/YYYY HH:mm')}`}</Text>
            }
          </Group>

          <Group gap={0} pos={"absolute"} bottom={20} right={0} bg={colorScheme === "dark" ? "#fff" : "#101010"} style={{ borderRadius: "10px 0 0 10px" }} px={5} py={2}>
            <Image
              src={"/assets/ebay-logo.svg"}
              w={35}
              alt="ebay"
              onClick={() =>
                searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
              }
            />
            <IconExternalLink size={15} color={colorScheme === "dark" ? "#101010" : "#fff"} />
          </Group>
        </Stack>
      </Paper>
    </Box>
  )
}
export default CardMobile;