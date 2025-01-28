import { Box, Group, Image, Input, SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Set } from "../_interfaces/set.interface";
import { tcgdexService } from "../_services/tcgdex.service";
import styles from './SetPage.module.scss';
import { ebayService } from "../_services/ebay.service";
import { IconSearch } from "@tabler/icons-react";
import { CardBrief } from "../_interfaces/card.interface";

const SetPage = () => {

  const { setId } = useParams();
  const { getSetById, getImageUrl } = tcgdexService;
  const { searchOnEbay } = ebayService;

  const [set, setSet] = useState<Set | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredCards, setFilteredCards] = useState<CardBrief[]>([]);

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});


  const loadSet = async () => {
    const setData = await getSetById(setId!)
    if (setData) {
      const customData = {
        ...setData,
        cards: setData.cards ? setData.cards.reverse() : []
      }
      setSet(customData);
      setFilteredCards(customData.cards);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (set?.cards) {
      const filtered = set.cards.filter((card) =>
        card.name.toLowerCase().includes(value)
      );
      setFilteredCards(filtered);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };


  useEffect(() => {
    loadSet();
  }, [])

  return (
    <div>
      <Stack w={"100%"}>
        <Group align="center">
          <Image
            src={getImageUrl(set?.logo!, 'png')}
            w={150}
            maw={150}
          />
          <Title>{set?.name}</Title>
        </Group>
        <Input
          leftSection={<IconSearch />}
          placeholder="Rechercher un pokémon..."
          value={searchValue}
          onChange={handleSearchChange}
          mb={"md"}
        />
      </Stack>
      <SimpleGrid cols={{ base: 2, xs: 3, md: 4, lg: 5, xl: 6 }}>
        {filteredCards?.length > 0
          && filteredCards.map(card =>
            <Box
              className={styles.card_img}
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
              <Image
                src={getImageUrl(card.image, "png", "low")}
                onClick={() =>
                  searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
                }
                onLoad={() => handleImageLoad(card.id)}
                pos={"absolute"}
                top={0}
                left={0}
                w={"100%"}
                h={"100%"}
                fit={"cover"}
                display={loadedImages[card.id] ? "block" : "none"}
              />
            </Box>
          )}
      </SimpleGrid>
    </div>
  )
}

export default SetPage;