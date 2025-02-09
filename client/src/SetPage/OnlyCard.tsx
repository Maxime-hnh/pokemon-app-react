import { CardBrief } from "../_interfaces/card.interface";
import { ActionIcon, Avatar, Box, Image, SimpleGrid, Skeleton, useMantineColorScheme } from "@mantine/core";
import styles from './SetPage.module.scss';
import { tcgdexService } from "../_services/tcgdex.service";
import { ebayService } from "../_services/ebay.service";
import { Set } from "../_interfaces/set.interface";
import { IconSearch } from "@tabler/icons-react";


interface OnlyCardProps {
  set: Set;
  filteredCards: CardBrief[];
  myCards: string[];
  handleImageLoad: (cardId: string) => void;
  loadedImages: Record<string, boolean>;
}

const OnlyCard = ({ set, filteredCards, handleImageLoad, loadedImages }: OnlyCardProps) => {

  const { getImageUrl } = tcgdexService;
  const { searchOnEbay } = ebayService;

  return (
    <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 5, xl: 6 }} spacing={"xs"}>
      {filteredCards?.length > 0
        && filteredCards.map(card =>
          <Box
            key={card.id}
            pos={"relative"}
            w={"100%"}
            pt={"140%"}
            style={{ overflow: "hidden" }}
            className={styles.onlyCard_img}

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
            <Image
              display={loadedImages[card.id] ? "block" : "none"}
              pos={"absolute"}
              top={0}
              left={0}
              w={"100%"}
              h={"100%"}
              src={getImageUrl(card.image, "png", "low")}
              onClick={() =>
                searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
              }
              onLoad={() => handleImageLoad(card.id)}
              fit={"cover"}
            />
            <Box w={20} h={15} pos={"absolute"} bg={"white"} style={{ borderRadius: "0 0 5px 0" }} bottom={0} right={0}></Box>
            <Avatar
              pos={"absolute"}
              bottom={0}
              variant="filled"
              right={0}
              radius={"xl"}
              color="white"
              size={"md"}
              onClick={() =>
                searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
              }
            >
              <IconSearch size={20} />
            </Avatar>
          </Box>
        )}
    </SimpleGrid>
  )
}

export default OnlyCard;