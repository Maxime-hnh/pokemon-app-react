import { Box, Button, Checkbox, Group, Image, Input, Paper, SimpleGrid, Skeleton, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Set } from "../_interfaces/set.interface";
import { tcgdexService } from "../_services/tcgdex.service";
import styles from './SetPage.module.scss';
import { ebayService } from "../_services/ebay.service";
import { IconSearch } from "@tabler/icons-react";
import { CardBrief } from "../_interfaces/card.interface";
import { dbFirebaseServie } from "../_services/dbFirebase.service";
import { authStore } from "../_store/auth.store";
import AppContext from "../App/AppContext";
import CardMobile from "./CardMobile";

const SetPage = () => {

  const { setId } = useParams();
  const { isMobile } = useContext(AppContext);
  const { getSetById, getImageUrl } = tcgdexService;
  const { searchOnEbay } = ebayService;
  const { addFavorite, deleteFavorite, getFavorites } = dbFirebaseServie;
  const { loggedUser } = authStore;

  const [set, setSet] = useState<Set | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredCards, setFilteredCards] = useState<CardBrief[]>([]);
  const { colorScheme } = useMantineColorScheme();
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});


  const loadData = async () => {
    //set
    const setData = await getSetById(setId!)
    if (setData) {
      const customData = {
        ...setData,
        cards: setData.cards ? setData.cards.reverse() : []
      }
      setSet(customData);
      setFilteredCards(customData.cards);
    };

    //favs
    setIsLoading(true);
    const favData = await getFavorites(loggedUser.uid);
    if (favData) {
      setFavorites(favData)
      setIsLoading(false);
    }
    return;
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

  const handleImageLoad = (cardId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const handleFavoriteToggle = async (cardId: string, checked: boolean) => {
    if (checked) {
      await addFavorite(loggedUser.uid, cardId);
      setFavorites([...favorites, cardId]);
    } else {
      await deleteFavorite(loggedUser.uid, cardId);
      setFavorites(favorites.filter(id => id !== cardId));
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div>
      <Stack w={"100%"}>
        <Group align="center" justify="center">
          {set?.logo
            ? <Image
              src={getImageUrl(set.logo, 'png')}
              w={150}
              maw={150}
            />
            : <Title>{set?.name}</Title>
          }
        </Group>
        <Input
          leftSection={<IconSearch />}
          placeholder="Rechercher un pokémon..."
          value={searchValue}
          onChange={handleSearchChange}
          mb={"md"}
        />
      </Stack>
      <SimpleGrid cols={{ base: 2, xs: 3, md: 3, lg: 4, xl: 5 }} spacing={"xs"}>
        {filteredCards?.length > 0
          && filteredCards.map(card =>
            isMobile ?
              <CardMobile
                set={set!}
                card={card}
                favorites={favorites}
                handleFavoriteToggle={handleFavoriteToggle}
                handleImageLoad={handleImageLoad}
                loadedImages={loadedImages}
                isLoading={isLoading}
              />
              : <Box
                key={card.id}
                pos={"relative"}
                w={"100%"}
                pt={"140%"}
                style={{ overflow: "hidden" }}
                onClick={() => addFavorite(loggedUser.uid, card.id)}
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
                    align="center"
                    justify="space-between"
                    p={"sm"}
                  >
                    <Group justify="space-between" w={"100%"}>
                      <Text>{card.localId}/{set?.cardCount.official}</Text>
                      {isLoading
                        ? <Skeleton w={24} h={24} />
                        : <Checkbox
                          color="green"
                          size="md"
                          checked={favorites.includes(card.id)}
                          onChange={(event) => handleFavoriteToggle(card.id, event.currentTarget.checked)}
                          style={{ cursor: "pointer" }}
                        />
                      }
                    </Group>
                    <Image
                      className={styles.card_img}
                      src={getImageUrl(card.image, "png", "low")}
                      onClick={() =>
                        searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
                      }
                      onLoad={() => handleImageLoad(card.id)}
                      fit={"cover"}
                      w={"60%"}
                    />
                    <Group justify="space-between" w={"100%"}>

                      <Text
                        fw={"bold"}
                      >
                        50.00 €
                      </Text>
                      <Button
                        leftSection={<IconSearch />}
                        variant="outline"
                        color="yellow"
                      >
                        Ebay
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              </Box>
          )}
      </SimpleGrid>
    </div>
  )
}

export default SetPage;