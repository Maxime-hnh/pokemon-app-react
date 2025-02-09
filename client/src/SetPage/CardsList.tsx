import { Accordion, Badge, Group, Image, Loader, Skeleton, Stack, Text, useMantineColorScheme } from "@mantine/core";

import { Set } from "../_interfaces/set.interface";

import { CardBrief } from "../_interfaces/card.interface";

import { sanitizeKey } from "../_helpers/helpers";
import { useState } from "react";
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { cardService } from "../_services/card.service";
import { IconArrowRightBar, IconRefresh, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";


interface CardListProps {
  set: Set;
  data: CardBrief;
  myCards: string[];
  handleFavoriteToggle: (setId: string, cardId: string) => void;
  handleImageLoad: (cardId: string) => void;
  loadedImages: Record<string, boolean>;
  isLoading: boolean;
}

const CardList = ({ set, data, myCards, handleFavoriteToggle, handleImageLoad, loadedImages, isLoading }: CardListProps) => {

  const [card, setCard] = useState<CardBrief>(data)
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
    <Accordion.Item key={card.id} value={card.id}>
      <Accordion.Control>
        <Group align="center" gap={3} justify="space-between" mr={15}>
          <Group>
            <Text fz={"xs"} className="titleFont">{card.name}</Text>
            <Text fz={"xs"}>{card.localId}/{set?.cardCount.official}</Text>
          </Group>
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
              onClick={() => handleFavoriteToggle(set!.id, card.id)}
            />
          }
        </Group>
      </Accordion.Control>

      <Accordion.Panel>
        <Group pos={"relative"}>
          <Image
            w={"25%"}
            src={getImageUrl(card.image, "png", "low")}
            onClick={() =>
              searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
            }
            fit={"cover"}
          />
          <Stack justify="flex-start" align="flex-start" gap={0}>
            <Stack gap={0}>
              {card.averagePrice
                && <Badge radius={0} size="md" p={0} fw={"bold"} variant="transparent" color="blue" leftSection={<IconArrowRightBar color="#228be6" size={15} />}>
                  {priceIsLoading
                    ? <Loader color="blue" size="xs" type="dots" />
                    : `${card.averagePrice} €`
                  }
                </Badge>
              }

              {card.averagePrice !== card.lowestPrice
                && <Badge radius={0} size="md" p={0} fw={"bold"} variant="transparent" color="green" leftSection={<IconTrendingDown color="green" size={15} />}>
                  {priceIsLoading
                    ? <Loader color="green" size="xs" type="dots" />
                    : `${card.lowestPrice} €`
                  }
                </Badge>
              }

              {card.averagePrice !== card.highestPrice
                && <Badge radius={0} size="md" p={0} fw={"bold"} variant="transparent" color="red" leftSection={<IconTrendingUp color="red" size={15} />}>
                  {priceIsLoading
                    ? <Loader color="red" size="xs" type="dots" />
                    : `${card.highestPrice} €`
                  }
                </Badge>
              }
            </Stack>
            <Group
              gap={3}
              pos={"absolute"}
              bottom={0}
              wrap="nowrap"
              align="center"
              onClick={() => updatePrices(set.serie.id, set.id, card.id)}
            >
              <IconRefresh
                color="#828282"
                size={12}
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: priceIsLoading ? "rotate(360deg)" : "rotate(0deg)",
                  animation: priceIsLoading ? "spin 1s linear infinite" : "none",
                }}
              />
              <Text fz={10} c={"dimmed"}>Dernière MAJ :</Text>
              {priceIsLoading
                ? <Loader color="blue" size="xs" type="dots" />
                : <Text fz={10} c={"dimmed"}>{`${dayjs(card.lastPriceUpdate).format('DD/MM/YYYY HH:mm')}`}</Text>
              }
            </Group>
          </Stack>

        </Group>
      </Accordion.Panel>

    </Accordion.Item>
  )
}
export default CardList;