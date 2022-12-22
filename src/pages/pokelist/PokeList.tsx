import {
  AssignmentLate,
  CatchingPokemon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Stack,
  Container,
  Tabs,
  Tab,
  List,
  ListItemText,
  Typography,
  Collapse,
  ListItem,
  IconButton,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { sv } from "../../data/sv";

export const PokeList: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [catchingList, setCatchingList] = useState<number[]>(
    JSON.parse(localStorage.getItem("sv.catchingList") ?? "[]")
  );
  const handleToggleCatch = (index: number, isCatch: boolean) => {
    const newList = isCatch
      ? [...catchingList, index]
      : catchingList.filter((cli) => cli !== index);
    localStorage.setItem("sv.catchingList", JSON.stringify(newList));
    setCatchingList(newList);
  };
  const handleChangeTab = (_: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };
  return (
    <Container
      component={Paper}
      variant="outlined"
      maxWidth="sm"
      sx={{
        height: "100vh",
        "@supports (height: 100dvh)": { height: "100dvh" },
      }}
    >
      <Stack height="100%">
        <Tabs variant="fullWidth" value={tabIndex} onChange={handleChangeTab}>
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentLate />
                <Typography>
                  未捕獲({sv.length - catchingList.length})
                </Typography>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <CatchingPokemon />
                <Typography>捕獲済({catchingList.length})</Typography>
              </Stack>
            }
          />
        </Tabs>
        <List dense sx={{ overflow: "auto" }}>
          {sv.map((item, index) =>
            (tabIndex === 0 && catchingList.includes(index)) ||
            (tabIndex === 1 &&
              !catchingList.includes(index)) ? undefined : (
              <ListItem
                divider
                key={item.name}
                secondaryAction={
                  <IconButton
                    onClick={() => handleToggleCatch(index, tabIndex === 0)}
                  >
                    <CatchingPokemon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.no} ${item.name}`}
                  secondary={
                    <>
                      {!!item.evolution ||
                        !!item.wild.length ||
                        "👴🏼これはレアなポケモンじゃぞ！！"}
                      {item.evolution}
                      {item.evolution && <br />}
                      <ArrayCollapse data={item.wild} />
                    </>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </Stack>
    </Container>
  );
};

const ArrayCollapse: React.FC<{ data: string[] }> = ({ data }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Stack direction="row" alignItems="center">
        <span>{data[0]}</span>
        {1 < data.length && (
          <IconButton
            sx={{ padding: 0 }}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Stack>
      <Collapse in={open}>
        {data.slice(1).map((item, index) => (
          <div key={index}>
            {item}
            <br />
          </div>
        ))}
      </Collapse>
    </>
  );
};
