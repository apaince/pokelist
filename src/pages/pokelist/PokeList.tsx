import {
  AssignmentLate,
  CatchingPokemon,
  ExpandLess,
  ExpandMore,
  Sort,
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
  Tooltip,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { sv } from "../../data/sv";

export const PokeList: React.FC = () => {
  //選択中のタブ
  const [tabIndex, setTabIndex] = useState(0);

  //捕獲済みのIndexリスト
  const [catchingList, setCatchingList] = useState<number[]>(
    JSON.parse(localStorage.getItem("sv.catchingList") ?? "[]")
  );

  //捕獲済みの表示順
  const [catchingListSort, setCatchingListSort] = useState<"index" | "catched">(
    "index"
  );

  //表示対象のリスト
  const displayList = useMemo(() => {
    if (tabIndex === 1 && catchingListSort === "catched")
      return catchingList.map((item) => sv[item]);
    return sv.filter(
      (item) =>
        (tabIndex === 0 && !catchingList.includes(item.index)) ||
        (tabIndex === 1 && catchingList.includes(item.index))
    );
  }, [tabIndex, catchingList, catchingListSort]);

  //捕獲済み・未捕獲の切り替えボタン押下時処理
  const handleToggleCatch = useCallback(
    (index: number, isCatch: boolean) => {
      const newList = isCatch
        ? [...catchingList, index]
        : catchingList.filter((cli) => cli !== index);
      localStorage.setItem("sv.catchingList", JSON.stringify(newList));
      setCatchingList(newList);
    },
    [catchingList, setCatchingList]
  );

  //タブ変更処理
  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, newTabIndex: number) => {
      setTabIndex(newTabIndex);
    },
    [setTabIndex]
  );

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
        <List dense sx={{ overflow: "auto", flexGrow: 1 }}>
          {displayList.map((item) => (
            <ListItem
              divider
              key={item.name}
              secondaryAction={
                <IconButton
                  onClick={() => handleToggleCatch(item.index, tabIndex === 0)}
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
          ))}
        </List>
        {tabIndex === 1 && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-around"
          >
            <Tooltip
              title={
                catchingListSort === "index" ? "捕獲順で表示" : "No順で表示"
              }
            >
              <IconButton
                onClick={() =>
                  setCatchingListSort(
                    catchingListSort === "index" ? "catched" : "index"
                  )
                }
              >
                <Sort />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
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
