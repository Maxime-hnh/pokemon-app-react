import { Accordion, Container, Group, Image, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { tcgdexService } from "../_services/tcgdex.service";
import { Serie } from "../_interfaces/serie.interface";
import styles from './HomePage.module.scss';
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const [series, setSeries] = useState<Serie[]>([]);
  const { getSeriesWithSet } = tcgdexService;

  const loadSeries = async () => {
    const data = await getSeriesWithSet();
    if (data) setSeries(data);
  }
  const navigate = useNavigate();

  useEffect(() => {
    loadSeries();
  }, [])

  return (
    <Container>
      <Accordion variant="default">
        {series?.length > 0
          && series.map(serie =>
            <Accordion.Item
              key={serie.id}
              value={serie.name}
            >
              <Accordion.Control py={"sm"}>
                <Group>
                  <Image
                    src={"/pokeball.png"}
                    w={40}
                  />
                  <Title order={3}>{serie.name}</Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid mt={"sm"} cols={{ base: 1, xs: 2, sm: 3, md: 4, xl: 4 }}>
                  {serie.sets?.length > 0
                    && serie.sets.map(set =>
                      <Paper
                        h={125}
                        mah={125}
                        key={set.id}
                        className={styles.set_container}
                        bg={"white"}
                        p={"md"}
                        radius={"md"}
                        display={"flex"}
                        style={{ cursor: 'pointer', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => navigate(`/set/${set.id}`)}
                      >
                        {set.logo
                          ? <Image
                            mah={80}
                            className={styles.set_logo}
                            key={set.id}
                            src={set.logo}
                            fit="contain"
                            alt={""}
                          />
                          : <Text fw={"bold"} ta={"center"} c={"black"}>{set.name}</Text>
                        }
                      </Paper>
                    )}
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          )}
      </Accordion>
    </Container >
  )
}

export default HomePage;